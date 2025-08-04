import type { Contact } from '../../generated/prisma/index.js';
import { PrismaClient, LinkPrecedence } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

/** find matches by email/phone */
export async function findMatches(email?: string, phoneNumber?: string): Promise<Contact[]> {
    return prisma.contact.findMany({
        where: {
            OR: [
                email ? { email } : {},
                phoneNumber ? { phoneNumber: phoneNumber?.toString() } : {},
            ],
        },
        orderBy: { id: 'asc' },
    });
}

/** find all related contacts (matches + linked) */
export async function findRelatedContacts(matches: Contact[]): Promise<Contact[]> {
    const ids = matches.map(c => c.id);
    return prisma.contact.findMany({
        where: {
            OR: [
                { id: { in: ids } },
                { linkedId: { in: ids } },
            ],
        },
        orderBy: { id: 'asc' },
    });
}

/** convert all other primes in group to seconds*/
export async function mergeContacts(
    relatedContacts: Contact[],
    primaryId: number,
    email?: string,
    phoneNumber?: string
) {
    // set primes to seconds
    await prisma.contact.updateMany({
        where: {
            id: { in: relatedContacts.map(c => c.id).filter(id => id !== primaryId) },
            linkPrecedence: LinkPrecedence.PRIMARY,
        },
        data: {
            linkedId: primaryId,
            linkPrecedence: LinkPrecedence.SECONDARY,
        },
    });

    // if exists in group
    const emailExists = email && relatedContacts.some(c => c.email === email);
    const phoneExists = phoneNumber && relatedContacts.some(c => c.phoneNumber === phoneNumber?.toString());
    const comboExists = relatedContacts.some(
        c => c.email === email && c.phoneNumber === phoneNumber?.toString()
    );

    // create rec if email && ph.no != null
    if (email && phoneNumber) {
        if ((!emailExists || !phoneExists) && !comboExists) {
            await prisma.contact.create({
                data: {
                    email,
                    phoneNumber: phoneNumber.toString(),
                    linkedId: primaryId,
                    linkPrecedence: LinkPrecedence.SECONDARY,
                },
            });
        }
    } else {
        // if only one is not null, create if unique/new
        if (email && !emailExists) {
            await prisma.contact.create({
                data: {
                    email,
                    phoneNumber: null,
                    linkedId: primaryId,
                    linkPrecedence: LinkPrecedence.SECONDARY,
                },
            });
        } else if (phoneNumber && !phoneExists) {
            await prisma.contact.create({
                data: {
                    email: null,
                    phoneNumber: phoneNumber.toString(),
                    linkedId: primaryId,
                    linkPrecedence: LinkPrecedence.SECONDARY,
                },
            });
        }
    }
}


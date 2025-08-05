import type { Request, Response } from 'express';
import { PrismaClient, LinkPrecedence } from '../../generated/prisma/index.js';
import { findMatches, findRelatedContacts, mergeContacts } from '../services/contact.service.js';

const prisma = new PrismaClient();

export const identifyContact = async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        return res.status(400).json({ error: 'Provide at least email or phoneNumber' });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    const matches = await findMatches(email, phoneNumber);
    let primaryId: number;

    if (matches.length === 0) {
        // no match -> create primary
        const newContact = await prisma.contact.create({
            data: {
                email,
                phoneNumber: phoneNumber?.toString(),
                linkPrecedence: LinkPrecedence.PRIMARY,
            },
        });
        primaryId = newContact.id;
    } else {
        // match found -> add w/ related contacts
        const relatedContacts = await findRelatedContacts(matches);
        primaryId = Math.min(...relatedContacts.map(c => c.linkedId ?? c.id));
        await mergeContacts(relatedContacts, primaryId, email, phoneNumber);
    }

    // get all contacts set for res
    const allContacts = await prisma.contact.findMany({
        where: { OR: [{ id: primaryId }, { linkedId: primaryId }] },
        orderBy: { id: 'asc' },
    });

    const primaryContact = allContacts.find(c => c.id === primaryId)!;
    const emails = Array.from(new Set([primaryContact.email, ...allContacts.map(c => c.email)].filter(Boolean) as string[]));
    const phoneNumbers = Array.from(new Set([primaryContact.phoneNumber, ...allContacts.map(c => c.phoneNumber)].filter(Boolean) as string[]));
    const secondaryIds = allContacts.filter(c => c.id !== primaryId).map(c => c.id);

    return res.status(200).json({
        contact: {
            primaryContactId: primaryId,
            emails,
            phoneNumbers,
            secondaryContactIds: secondaryIds,
        },
    });
};

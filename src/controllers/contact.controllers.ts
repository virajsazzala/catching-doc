import type { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

export const identifyContact = async (req: Request, res: Response) => {
    const { email, phoneNumber } =  req.body;

    if (!email && !phoneNumber) {
        return res.status(400).json({ error: 'Provide at least email or phoneNumber :)' });
    }

    const contact = await prisma.contact.create({
        data: {
            email,
            phoneNumber,
        },
    });

    return res.status(201).json(contact);
};
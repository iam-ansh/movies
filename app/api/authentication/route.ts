import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const validation = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(20),
    displayName: z.string().min(3).max(20),
    password: z.string().min(8)
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, { message: 'Contain at least one special character.', })
        .max(20)
})

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = validation.safeParse(body);
        if(!parsed.success){
            return NextResponse.json({message : "validation error"})
        }
        const {email, username, displayName, password} = parsed.data;

        const ifExist = await prisma.user.findUnique({ where: { email: email, username: username } });
        if (ifExist) {
            return NextResponse.json({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                email: email,
                username: username,
                displayName: displayName,
                password: hashedPassword
            }
        })
        return NextResponse.json({ message: "Signed up successfully" });

    } catch (error: unknown) {
        console.log("error in signing up ", error);
        return NextResponse.json({ message: "something went wrong in signing up!" }, { status: 500 })
    }
} 
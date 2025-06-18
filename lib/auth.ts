import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "../generated/prisma";
import { generateFromEmail } from "unique-username-generator";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    providers: [
        credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "enter your email here" },
                password: { label: "Password", type: "password", placeholder: "enter your password here" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }
                try {
                    const user = await prisma.user.findUnique({ where: { email: credentials?.email } });
                    if (!user) {
                        console.log("user not found");
                        return null;
                    }
                    const compare = await bcrypt.compare(credentials?.password, user.password);
                    if (!compare) {
                        console.log("wrong password")
                        return null;
                    }
                    return {
                        id: user.id.toString(),
                        email: user.email,
                    };

                } catch (error: unknown) {
                    console.log("error in signing in");
                    return null;
                }
            }
        }),

        GoogleProvider({
            name: "google",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

        }),
    ],
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/',
    },
    callbacks: {
        async signIn({ user }) {
            if (!user) {
                console.log("user does not exist");
                return false;
            }
            try {
                const findUser = await prisma.user.findUnique({ where: { email: user.email! } });
                if (findUser) {
                    return true;
                }
                let isUnique = false;
                let uniqueUsername = "";
                while (!isUnique) {
                    uniqueUsername = generateFromEmail(
                        user.email as string,
                        4
                    )
                    const ifExist = await prisma.user.findUnique({ where: { username: uniqueUsername } });
                    if (!ifExist) {
                        isUnique = true
                    }
                }
                await prisma.user.create({
                    data: {
                        email: user.email as string,
                        username: uniqueUsername,
                        displayName: user.name as string,
                        password: user.id
                    }
                })
                return true
            } catch (error: unknown) {
                console.log("error in signin callback");
                return false;
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ token, session }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        }
    }

}

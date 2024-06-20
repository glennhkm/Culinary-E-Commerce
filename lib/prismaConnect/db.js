import { PrismaClient } from "@prisma/client";

// const prisma = process.env.NODE_ENV === "production" ? new PrismaClient() : global.prisma ?? new PrismaClient();
const prisma = process.env.NODE_ENV === "production" ? new PrismaClient() : global.prisma ?? new PrismaClient();

export const db = prisma;

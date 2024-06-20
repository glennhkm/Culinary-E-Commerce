import { db } from "@/lib/prismaConnect/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Change User Password
export const PATCH = async (req, { params }) => {
    const values = await req.json();    
    const { userId } = params;
    try {
        const user = await db.users.findUnique({
            where: {
                id: userId,
            },
        });
        const isMatchPassword = await bcrypt.compare(values.currentPassword, user.password);
        if (!isMatchPassword) {
            return NextResponse.json({ message: "Password saat ini salah" }, { status: 400 });
        };
        const hashedPassword = await bcrypt.hash(values.newPassword, 10);
        const newUser = await db.users.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword,
            },
        });
        return NextResponse.json(newUser);
    } catch (error) {
        console.log("ERROR: ", error.message);
        return new NextResponse(error.message, 500);
    }
}
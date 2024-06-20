import { db } from "@/lib/prismaConnect/db";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    const values = await req.json();
    const now = new Date();
    try {
        await db.paymentConfirmation.create({
            data: {
                ...values
            }
        })
        await db.transaction.update({
            where: {
                id: values.idTransaction
            },
            data: {
                paymentDate: now,
                status: 'MENUNGGU_APPROVAL'
            }
        })
        return NextResponse.json({message: "Success add payment confirmation and update transaction status"}, { status: 200 });
    } catch (error) {
        console.log("ERROR CREATE PAYMENT CONFIRMATION: ", error.message);
        return new NextResponse.json(error.message, 500);
    }
}
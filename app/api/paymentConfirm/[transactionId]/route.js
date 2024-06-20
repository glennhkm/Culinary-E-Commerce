import { db } from "@/lib/prismaConnect/db";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
    const { transactionId } = params;
    try {
        const paymentConfirmation = await db.paymentConfirmation.findFirst({
            where: {
                idTransaction: transactionId
            }
        });
        return NextResponse.json(paymentConfirmation);
    } catch (error) {
        console.log("ERROR GET PAYMENT CONFIRMATION: ", error.message);
        return new NextResponse(error.message, 500);
    }
}
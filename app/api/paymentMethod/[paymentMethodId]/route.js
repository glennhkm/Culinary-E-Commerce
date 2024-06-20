import { db } from "@/lib/prismaConnect/db";
import { NextResponse } from "next/server";

export const PATCH = async (req, { params }) => {
    try {
        const { paymentMethodId } = params;
        const values = await req.json();
        const paymentMethod = await db.paymentMethod.update({
            where: {
                id: paymentMethodId
            },
            data: {
                ...values
            }
        });
        return NextResponse.json(paymentMethod);
    } catch (error) {
        console.log("ERROR PATCH PAYMENT METHOD: ", error.message);
        return new NextResponse(error.message, 500);
    }
}

export const DELETE = async (req, { params }) => {
    try {
        const { paymentMethodId } = params;
        const paymentMethod = await db.paymentMethod.delete({
            where: {
                id: paymentMethodId
            }
        });
        return NextResponse.json(paymentMethod);
    } catch (error) {
        console.log("ERROR DELETE PAYMENT METHOD: ", error.message);
        return new NextResponse(error.message, 500);
    }
}
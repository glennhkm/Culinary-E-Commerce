import { db } from "@/lib/prismaConnect/db"
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const paymentMethods = await db.paymentMethod.findMany();
        console.log("PAYMENT METHOD: ", paymentMethods);
        return NextResponse.json(paymentMethods);
    } catch (error) {
        console.log("ERROR GET PAYMENT METHOD: ", error.message);
        return new NextResponse(error.message, 500);
    }
}

export const POST = async (req) => {
    const values = await req.json();
    try {
        const paymentMethod = await db.paymentMethod.create({
            data: {
                ...values
            }
        });
        return NextResponse.json(paymentMethod);
    } catch (error) {
        console.log("ERROR POST PAYMENT METHOD: ", error.message);
        return new NextResponse(error.message, 500);
    }
}
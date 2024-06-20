import { db } from "@/lib/prismaConnect/db";
import { NextResponse } from "next/server";

// Get Variants by Product ID
export const GET = async (req, {params}) => {
    const { productId } = params;
    try {
        const variants = await db.variants.findMany({
            where: {
                idProduct: productId
            }
        });
        return NextResponse.json(variants);
    } catch (error) {
        console.log("ERROR GET VARIANTS: ", error.message);
        return new NextResponse(error.message, 500);
    }
}
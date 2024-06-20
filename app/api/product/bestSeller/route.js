import { db } from "@/lib/prismaConnect/db";
import { NextResponse } from "next/server";


// Get Best Seller Products
export const GET = async () => {
    try {
        const products = await db.products.findMany({
            where: {
                bestSeller: true
            }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.log("ERROR GET BEST SELLER PRODUCTS: ", error.message);
        return new NextResponse(error.message, 500);
    }
}
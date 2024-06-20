import { db } from "@/lib/prismaConnect/db";
import { NextResponse } from "next/server";

// Get All Featured Media Assets
export const GET = async () => {
    try {
        const mediaAssets = await db.mediaAssets.findMany({
            where: {
                imageProductType: 'FEATURED'
            }
        });
        return NextResponse.json(mediaAssets);
    } catch (error) {
        return new NextResponse(error.message);
    }
}   
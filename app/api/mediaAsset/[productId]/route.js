import { db } from "@/lib/prismaConnect/db";
import { NextResponse } from "next/server";

// Get Media Asset By Product Id
export const GET = async (req, { params }) => {
  const { productId } = params;
  try {
    const mediaAssets = await db.mediaAssets.findMany({
      where: {
        idProduct: productId,
      },
    });
    return NextResponse.json(mediaAssets);
  } catch (error) {
    return new NextResponse(error.message, 500);
  }
};

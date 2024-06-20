import { db } from "@/lib/prismaConnect/db";
import { NextResponse } from "next/server";

// Get All Categories
export const GET = async () => {
    try {
      const categories = await db.productCategories.findMany();
      return NextResponse.json(categories);
    } catch (error) {
      console.log("ERROR GET CATEGORIES: ", error.message);
      return new NextResponse(error.message, 500);
    }
} 
import { db } from "@/lib/prismaConnect/db"
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const dashboard = await db.dashboard.findMany();
        return NextResponse.json(dashboard);
    } catch (error) {
        console.log("ERROR GET DASHBOARD: ", error.message);
        return new NextResponse.json(error.message, 500);
    }
}
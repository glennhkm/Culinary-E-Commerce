import { db } from "@/lib/prismaConnect/db";
import { isAdmin } from "@/lib/sessionManagement/sessionCheck";
import { add } from "date-fns";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

// Create Transaction
export const POST = async (req) => {
  let values = await req.json();
  const deadlinePaymentDate = add(new Date(), { hours: 24 });
  try {
    await db.transaction.create({
      data: {
        ...values,
        deadlinePaymentDate,
      },
    });
    await db.products.update({
      where: {
        id: values.idProduct,
      },
      data: {
        stock: {
          decrement: values.quantity,
        },
      },
    });
    return NextResponse.json(
      { message: "Success create transaction" },
      { status: 200 }
    );
  } catch (error) {
    console.log("ERROR CREATE TRANSACTION: ", error.message);
    return new NextResponse(error.message, 500);
  }
};

// Get Transaction Base on Status
export const GET = async (req) => {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "ADMIN";
  try {
    const { searchParams } = new URL(req.url);
    const status1 = searchParams.getAll("status1");
    const status2 = searchParams.getAll("status2");
    const idUser = isAdmin ? {} : searchParams.get("idUser");
    const allStatus = status1.concat(status2 || status1);

    const transactions = await db.transaction.findMany({
      where: {
        AND: [
          {
            idUser,
          },
          {
            OR: allStatus.map((stat) => ({ status: stat })),
          },
        ],
      },
      include: {
        product: true,
        paymentMethod: true,
        variant: true,
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.log("ERROR GET TRANSACTION: ", error.message);
    return new NextResponse(error.message, { status: 500 });
  }
};

// Update Status of All fields of Transaction which has already passed the deadlinePaymentDate to "DIBATALKAN"
export const PATCH = async (req) => {
  const values = await req.json();
  const now = new Date();
  try {
    const updatedTransaction = await db.transaction.findMany({
      where: {
        paymentDate: null,
        deadlinePaymentDate: {
          lt: now,
        },
        status: 'MENUNGGU_PEMBAYARAN'
      },
    });
    for (const transaction of updatedTransaction) {
      try {
        await db.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            ...values,
          },
        });
        await db.products.update({
          where: {
            id: transaction.idProduct,
          },
          data: {
            stock: {
              increment: transaction.quantity,
            },
          },
        });
      } catch (error) {
        console.log(`ERROR UPDATING TRANSACTION OR PRODUCT ${transaction.id}: `, error.message);
      }
    }
    return NextResponse.json(
      {
        message: "Update Status of All fields of Transaction which has already passed the deadlinePaymentDate to DIBATALKAN",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("ERROR UPDATE TRANSACTION: ", error.message);
    return new NextResponse(error.message, 500);
  }
};

export const DELETE = async (req) => {
  const { data } = await req.json();  
  console.log("ID: ", data);
  console.log("Quantity: ", data.quantity);
}

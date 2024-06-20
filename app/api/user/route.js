import { db } from "@/lib/prismaConnect/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Get All Users
export const GET = async () => {
  try {
    const users = await db.users.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse(error.message, 500);
  }
};

// Add New User
export const POST = async (req) => {
  let values = await req.json();
  try {
    const isEmailExist = await db.users.findUnique({
      where: {
        email: values.email
      }
    })
    if(isEmailExist){
      return NextResponse.json({ message: "Email has been used before!" }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(values.password, 10);
    const userValues = {
      ...values,
      password: hashedPassword
    }
    const user = await db.users.create({
      data: {
        ...userValues,
      },
    });
    await db.dashboard.update({
      where: {
        id: "1",
      },
      data: {
        value: {
          increment: 1,
        },
      },
    })
    return NextResponse.json(user);
  } catch (error) {
    console.log("ERROR REGISTER: ", error.message);
    return new NextResponse(error.message, 500);
  }
};

// Bulk Delete Users
export const DELETE = async (req) => {
  const { ids } = await req.json();

  //   if (!Array.isArray(ids) || ids.length === 0) {
  //     return new NextResponse("Invalid IDs provided", { status: 400 });
  //   }

  try {
    let result;
    if(!Array.isArray(ids)){
      await db.users.deleteMany({});
      await db.dashboard.update({
        where: {
          id: "1",
        },
        data: {
          value: 0
        },
      })
    } else {
      result = await db.users.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
      await db.dashboard.update({
        where: {
          id: "1",
        },
        data: {
          value: {
            decrement: result.count,
          },
        },
      });
    }
    return NextResponse.json({ count: result.count });
  } catch (error) {
    return new NextResponse(error);
  }
};

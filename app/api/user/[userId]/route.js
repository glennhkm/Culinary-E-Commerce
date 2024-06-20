import { db } from "@/lib/prismaConnect/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession, updateSession } from "next-auth/react";

// Get User By ID
export const GET = async (req, { params }) => {
  const { userId } = params;
  try {
    const user = await db.users.findUnique({
      where: {
        id: userId,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
};

// Update User PUT
export const PUT = async (req, { params }) => {
  const values = await req.json();
  const { userId } = params;
  const { fullName, email, password, address, phoneNumber } = values;
  let userValues = { fullName, email, address, phoneNumber, password };
  if (values.isNewPassword) {
    const hashedPassword = await bcrypt.hash(values.password, 10);
    userValues.password = hashedPassword;
  }
  try {
    const user = await db.users.update({
      where: {
        id: userId,
      },
      data: {
        ...userValues,
      },
    });
    return NextResponse.json(user);
  } catch (error) {    
    console.log("ERROR UPDATE: ", error.message);
    return new NextResponse(error.message, { status: 500 });
  }
};

// Update User PATCH
export const PATCH = async (req, { params }) => {
  const values = await req.json();
  const { userId } = params;
  try {
    const user = await db.users.update({
      where: {
        id: userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("ERROR UPDATE: ", error.message);
    return new NextResponse(error.message, { status: 500 });
  }
}

// Delete User
export const DELETE = async (req, { params }) => {
  const { userId } = params;
  try {
    const user = await db.users.delete({
      where: {
        id: userId,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
};



// // Method Dispatcher
// export default async (req, context) => {
//   const { method } = req;
//   switch (method) {
//     case 'GET':
//       return GET(req, context);
//     case 'PUT':
//       return PUT(req, context);
//     case 'DELETE':
//       const { ids } = await req.json().catch(() => ({}));
//       if (ids) {
//         return BULK_DELETE(req);
//       } else {
//         return DELETE(req, context);
//       }
//     default:
//       return new NextResponse('Method Not Allowed', { status: 405 });
//   }
// };

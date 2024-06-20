import { db } from "@/lib/prismaConnect/db";
import { deleteImage } from "@/lib/uploadthing/deleteImage";
import { NextResponse } from "next/server";

export const PATCH = async (req, { params }) => {
    const { transactionId } = params;
    const values = await req.json();
    const keys = Object.keys(values);
    try {
        if (keys.length === 1 && keys.includes('idPaymentMethod')) {
            const paymentMethodSelected = await db.paymentMethod.findUnique({
                where: {
                    id: values.idPaymentMethod
                }
            })
            await db.transaction.update({
                where: {
                    id: transactionId
                },
                data: {
                    idPaymentMethod: values.idPaymentMethod
                }
            });
            if(paymentMethodSelected?.noRekening.trim() === null || paymentMethodSelected?.noRekening.trim() === "") {
                await db.transaction.update({
                    where: {
                        id: transactionId
                    },
                    data: {
                        status: "MENUNGGU_APPROVAL"
                    }
                });
            }
        } else {
            await db.transaction.update({
                where: {
                    id: transactionId
                },
                data: {
                    message: values.message,
                    status: values.status,  
                }
            })
            if(values?.status === "DIBATALKAN" && values?.transaction?.idProduct !== null) {
                await db.products.update({
                    where: {
                        id: values.transaction.idProduct
                    },
                    data: {
                        stock: {
                            increment: values.transaction.quantity
                        }
                    }
                })        
            } 
            else if(values?.status === "SELESAI") {
                await db.dashboard.update({
                    where: {
                        id: "3"
                    },
                    data: {
                        value: {
                            increment: 1
                        }
                    }
                });        
                await db.dashboard.update({
                    where: {
                        id: "4"
                    },
                    data: {
                        value: {
                            increment: parseInt(values.transaction.totalPrice)
                        }
                    }
                });        
            }
        }
        return NextResponse.json({ message: "Update Transaction Success" }, { status: 200 });
    } catch (error) {
        console.log("ERROR UPDATE TRANSACTION: ", error.message);
        return new NextResponse.json(error.message, 500);
    }
}

export const DELETE = async (req, { params }) => {
    const { transactionId } = params;
    try {
        const paymentConfirm = await db.paymentConfirmation.findFirst({
            where: {
                idTransaction: transactionId
            }
        });
        await db.transaction.delete({
            where: {
                id: transactionId
            }
        });
        await deleteImage(paymentConfirm?.imageKey);
        return NextResponse.json({ message: "Delete Transaction Success" }, { status: 200 });
    } catch (error) {
        console.log("ERROR DELETE TRANSACTION: ", error.message);
        return new NextResponse.json(error.message, 500);
    }
}


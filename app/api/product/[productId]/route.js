import { db } from "@/lib/prismaConnect/db";
import { NextResponse } from "next/server";

export const PUT = async (req, { params }) => {
  const { productId } = params;
  const values = await req.json();
  console.log("VALUES: ", values);
  const featuredImage = {
    mediaURL: values.assets.featuredImage.url,
    mediaKey: values.assets.featuredImage.key,
    idProduct: productId,
    imageProductType: "FEATURED",
  };
  const galleryImages = values.assets.images.map((item) => {
    return {
      mediaURL: item.url,
      mediaKey: item.key,
      idProduct: productId,
      imageProductType: "GALLERY",
    };
  });
  const variants = values.variantData;
  const productImages = [featuredImage, ...galleryImages];
  let productVariants;
  try {
    await db.variants.deleteMany({
      where: {
        idProduct: productId,
      },
    });
    if(variants.length > 0) {
      productVariants = await db.variants.createMany({
        data: variants,
      });
    }
    await db.mediaAssets.deleteMany({
      where: {
        idProduct: productId,
      },
    });    
    const product = await db.products.update({
      where: {
        id: productId,
      },
      data: {
        ...values.productData,
      },
    });
    const assets = await db.mediaAssets.createMany({
      data: productImages,
    });
    return new NextResponse(product, assets, productVariants);
  } catch (error) { 
    console.log("ERROR: ", error.message);
    console.log("ERROR: ", error.message);
    return new NextResponse(error.message, 500)
  }
};

export const DELETE = async (req, { params }) => {
    const { productId } = params;
    try {
        const deletedProducts = await db.products.delete({
            where: {
                id: productId
            }
        })
        await db.dashboard.update({
            where: {
                id: "2",
            },
            data: {
                value: {
                    decrement: 1,
                },
            },
        });
        return new NextResponse(deletedProducts);
    } catch (error) {
        console.log("ERROR: ", error.message);
        return new NextResponse(error.message, 500);
    }
}

export const GET = async (req, { params }) => {
  const { productId } = params;
  try {
    const product = await db.products.findUnique({
      where: {
        id: productId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return new NextResponse(error.message, 500);
  }
}
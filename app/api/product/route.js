import { db } from "@/lib/prismaConnect/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const products = await db.products.findMany();
    return NextResponse.json(products);
  } catch (error) {
    return new NextResponse(error.message);
  }
};

export const POST = async (req) => {
  const values = await req.json();
  const featuredImage = {
    mediaURL: values.assets.featuredImage.url,
    mediaKey: values.assets.featuredImage.key,
    idProduct: values.productData.id,
    imageProductType: "FEATURED",
  };
  const galleryImages = values.assets.images.map((item) => {
    return {
      mediaURL: item.url,
      mediaKey: item.key,
      idProduct: values.productData.id,
      imageProductType: "GALLERY",
    };
  });
  const variants = values.variantData.map((item) => {
    return {
      variantName: item.variantName,
      additionalPrice: item.additionalPrice,
      idProduct: values.productData.id,
    };
  });
  const productImages = [featuredImage, ...galleryImages];
  try {
    const product = await db.products.create({
      data: {
        ...values.productData,
      },
    });
    const assets = await db.mediaAssets.createMany({
      data: productImages,
    });
    const productVariants = await db.variants.createMany({
      data: variants,
    });
    await db.dashboard.update({
        where: {
          id: "2",
        },
        data: {
          value: {
            increment: 1,
          },
        },
      })
    return NextResponse.json({message: "Product has been added successfully!"}, {status: 200});
  } catch (error) {
    return new NextResponse(error.message);
  }
};

"use client";

import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { CardCatalog } from "@/components/cards/products/cardCatalog";
import { CardCategory } from "@/components/cards/products/cardCategory";
import { MoveRight } from "lucide-react";
import { croissant_one } from "@/lib/fonts/font";
import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const MainPage = () => {
  const [bestSellerProduct, SetBestSellerProduct] = useState([]);
  const [mediaAssets, SetMediaAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const dataCategories = [
    {
      image: "/images/kategori-makanan2.jpeg",
      namaKategori: "Makanan",
      description:
        "Hidangan khas Aceh dengan rempah-rempah kaya, menggabungkan rasa pedas dan gurih dari bahan-bahan segar seperti daging dan sayuran.",
    },
    {
      image: "/images/kategori-minuman2.jpg",
      namaKategori: "Minuman",
      description:
        "Minuman beraroma kuat yang menggabungkan kopi, teh, susu, dan rempah-rempah, mencerminkan kekayaan budaya kuliner Aceh.",
    },
  ];

  useEffect(() => {
    const getBestSellerProduct = async () => {
      try {
        const response = await axios.get("/api/product/bestSeller");
        if (response.status === 200) {
          SetBestSellerProduct(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.log("ERROR GET PRODUCTS: ", error);
        setLoading(false);
      }
    };

    const getMediaAssets = async () => {
      try {
        const response = await axios.get("/api/mediaAsset/featured");
        if (response.status === 200) {
          SetMediaAssets(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.log("ERROR GET MEDIA ASSETS: ", error);
        setLoading(false);
      }
    };

    getBestSellerProduct();
    getMediaAssets();
  }, []);

  const handleProductClick = (item) => {
    if (pathname.includes("/admin")) {
      SetEditingData(item);
    } else {
      router.push(`/menu/${item.id}`)
    }
  }

  return (
    <div className={`flex flex-col overflow-x-hidden w-screen`}>
      <div className="relative w-screen h-screen bg-[url('/images/blurredbanner.webp')] bg-cover">
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
          <Image
            src={"/images/logo-kuliner-typo.png"}
            width={500}
            height={500}
            priority
            alt="logo-fasha-kuliner-typo"
          />
        </div>
        <div className="absolute top-0 left-0 w-screen h-screen bg-gradient-to-t from-[#151515] to-transparent via-transparent"></div>
      </div>
      <div className="flex flex-col h-auto relative overflow-hidden">
        <div className=" bg-gradient-to-b from-[#151515] to-main_bg/60 via-main_bg/60 via-30% to-70% absolute top-0 left-0 h-full w-screen z-[5]"></div>
        <div className="absolute w-screen h-full -z-10 overflow-hidden bg-[url('/images/pattern.jpg')] bg-cover opacity-10"></div>
        <div className="flex flex-col px-12 z-10">
          <h2
            className={`pt-20 text-center font-bold text-main_bg text-6xl ${croissant_one.className} text-shadow-lg`}
          >
            Kategori Kuliner
          </h2>
          <div className="grid grid-cols-2 gap-7 pt-16 z-[1]">
            <CardCategory data={dataCategories} />
          </div>
          <h2
            className={`pt-20 text-center font-bold text-primary text-6xl ${croissant_one.className} text-shadow-lg`}
          >
            Hidangan Terlaris
          </h2>
          <div className="flex gap-5 pt-16 w-full">
            {loading ? (
              <p className="animate-blink w-full text-xl text-center text-primary font-semibold pt-32">
                Memuat Produk...
              </p>
            ) : (
              bestSellerProduct.map((item, index) => {
                let priceAfterDiscount;
                const mediaFeatured = mediaAssets?.find(
                  (media) =>
                    media.idProduct === item.id &&
                    (pathname.includes("/admin")
                      ? media.imageProductType === "FEATURED"
                      : true)
                );
                const mediaURL = mediaFeatured?.mediaURL;
                const formattedPrice = item.price
                  .toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  })
                  .replace("IDR", "Rp.")
                  .trim();
                if (item.discount && item.discount > 0) {
                  priceAfterDiscount =
                    item.price - item.price * (item.discount / 100);
                  priceAfterDiscount = priceAfterDiscount
                    .toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })
                    .replace("IDR", "Rp.")
                    .trim();
                }
                return (
                  <div
                    key={item.id}
                    onClick={() => handleProductClick(item)}
                    className={`cursor-pointer active:scale-100 rounded-xl h-[40vh] relative w-full p-4 flex flex-col gap-3 shadow-xl drop-shadow-2xl shadow-black/50 duration-200 hover:scale-[1.04] group ${
                      item.stock < 1 &&
                      !pathname.includes("/admin") &&
                      "pointer-events-none"
                    }`}
                  >
                    <div className="h-full w-full absolute top-0 left-0 duration-200 bg-gradient-to-t from-primary/95 to-black/20 via-black/20 group-hover:bg-black/40 rounded-xl -z-[5]"></div>
                    {item.stock < 1 && (
                      <div className="absolute flex justify-center items-center top-0 left-0 h-full w-full z-10 bg-black/75 rounded-xl">
                        <p className="font-bold text-main_bg text-[2.6rem]">
                          HABIS!
                          {isAdding && (
                            <CardAddProduct
                              closeModal={() => setIsAdding(false)}
                              updateTrigger={() =>
                                setUpdateTrigger((prev) => !prev)
                              }
                            />
                          )}
                        </p>
                      </div>
                    )}
                    <div className="absolute top-0 left-0 -z-10 w-full h-full rounded-xl">
                      {mediaURL ? (
                        <Image
                          src={mediaURL}
                          fill
                          className="rounded-xl object-cover"
                          loading="lazy"
                          alt="Product Image"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 rounded-xl flex items-center justify-center">
                          <p className="text-white/50 text-sm">No image</p>
                        </div>
                      )}
                    </div>
                    <div
                      className={`flex flex-col text-main_bg font-bold h-full justify-end`}
                    >
                      {item.discount > 0 && (
                        <p className="font-bold w-full bg-main_bg/95 text-2xl text-primary p-4 absolute top-0 left-0 rounded-t-xl">
                          DISKON {item.discount}%
                        </p>
                      )}
                      <div className="flex flex-col gap-2">
                        <p className="capitalize">{item.productName}</p>
                        <div className="flex gap-2">
                          {item.discount > 0 && <p>{priceAfterDiscount}</p>}
                          <p
                            className={`${
                              item.discount > 0 &&
                              "line-through font-normal opacity-60"
                            }`}
                          >
                            {formattedPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="w-full flex justify-end py-10">
            <Link href={"/menu"}>
              <button
                className={`flex gap-3 text-3xl font-bold pr-2 items-center text-primary hover:text-[#151515] hover:scale-105 active:scale-100 duration-200`}
              >
                <p className={`text-shadow-lg ${croissant_one.className}`}>
                  Lihat lebih banyak
                </p>
                <MoveRight size={40} className="text-shadow-lg" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;

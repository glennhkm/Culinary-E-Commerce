"use client";

// import Image from "next/legacy/image";
import { useState } from "react";
import { CardDetailProduct } from "./cardDetailProduct";
import { useAdminSidebarContext } from "@/context/adminSidebarContext";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export const CardCatalog = ({ data, mediaAssets, categories = {}, updateTrigger = false, loading }) => {
  const [editingData, SetEditingData] = useState(null);
  const { isShowSidebar } = useAdminSidebarContext();
  const router = useRouter();
  const pathname = usePathname();

  const handleProductClick = (item) => {
    if (pathname.includes("/admin")) {
      SetEditingData(item);
    } else {
      router.push(`/menu/${item.id}`)
    }
  }

  return (
    <>
      {loading && (
        <p
        className={`${pathname.includes("/admin") ? 'text-main_bg/85 text-shadow-default' : 'text-primary text-shadow-none'} animate-blink font-bold w-full text-center text-xl pt-10 tracking-wide ${
          isShowSidebar && pathname.includes("/admin") ? "col-span-3" : "col-span-4"
        }`}
      >
        Memuat produk...
      </p>
      )}
      {(data.length <= 0 && !loading) ? (
        <p
          className={`${pathname.includes("/admin") ? 'text-main_bg/85 text-shadow-default' : 'text-primary text-shadow-none'} font-bold w-full text-center text-xl pt-10 tracking-wide ${
            isShowSidebar && pathname.includes("/admin") ? "col-span-3" : "col-span-4"
          }`}
        >
          Produk tidak tersedia atau tidak cocok!
        </p>
      ) : (
        data.map((item) => {
          let priceAfterDiscount;
          const mediaFeatured = mediaAssets?.find(
            (media) =>
              media.idProduct === item.id && (pathname.includes("/admin") ? media.imageProductType === "FEATURED" : true)
          );
          const mediaURL = mediaFeatured?.mediaURL;
          console.log("mediaFeatured", mediaURL);
          const formattedPrice = item.price
            .toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            })
            .replace("IDR", "Rp.")
            .trim();
          if (item.discount && item.discount > 0) {
            priceAfterDiscount = (item.price) - (item.price * (item.discount / 100));
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
                (item.stock < 1 && !pathname.includes("/admin")) && "pointer-events-none"
              }`}
            >
              <div className="h-full w-full absolute top-0 left-0 duration-200 bg-gradient-to-t from-primary/95 to-black/20 via-black/20 group-hover:bg-black/40 rounded-xl -z-[5]"></div>
              {item.stock < 1 && (
                <div className="absolute flex justify-center items-center top-0 left-0 h-full w-full z-10 bg-black/75 rounded-xl">
                  <p className="font-bold text-main_bg text-[2.6rem]">
                    HABIS!
                  </p>
                </div>
              )}
              <div className="absolute top-0 left-0 -z-10 w-full h-full rounded-xl">
                <Image
                  src={mediaURL || '/images/food-default.jpg'}
                  fill
                  className="rounded-xl object-cover"
                  loading="lazy"
                  alt="Product Image"
                />
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
                    {item.discount > 0 && (
                      <p>{priceAfterDiscount}</p>
                      )}
                    <p className={`${item.discount > 0 && 'line-through font-normal opacity-60'}`}>{formattedPrice}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      {editingData && (
        <CardDetailProduct
          data={editingData}
          categories={categories}
          closeModal={() => SetEditingData(null)}
          mediaAssets={mediaAssets}
          updateTrigger={updateTrigger}
        />) 
      }
    </>
  );
};

"use client";

import axios from "axios";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CardOrder } from "@/components/cards/orders/cardOrder";
import { getSession } from "next-auth/react";

const DetailMenu = ({ params }) => {
  const [product, setProduct] = useState({});
  const [mediaAssets, setMediaAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdminRole, setIsAdminRole] = useState(null);
  const [isGuestRole, setIsGuestRole] = useState(null);
  const { productId } = params;
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isBuying, setIsBuying] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(`/api/product/${productId}`);
        if (response.status === 200) {
          setProduct(response.data);
        }
      } catch (error) {
        console.log("ERROR GET PRODUCT: ", error);
      }
    };

    const getVariants = async () => {
      try {
        const response = await axios.get(`/api/variant/${productId}`);
        if (response.status === 200) {
          setVariants(response.data);
        }
      } catch (error) {
        console.log("ERROR GET VARIANTS: ", error);
      }
    };

    const getMediaAssets = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/mediaAsset/${productId}`);
        if (response.status === 200) {
          const mediaAssets = response.data;
          setLoading(false);
          setMediaAssets(
            mediaAssets.sort((a, b) => {
              if (
                a.imageProductType === "FEATURED" &&
                b.imageProductType !== "FEATURED"
              ) {
                return -1;
              }
              if (
                a.imageProductType !== "FEATURED" &&
                b.imageProductType === "FEATURED"
              ) {
                return 1;
              }
              return 0;
            })
          );
        }
      } catch (error) {
        console.log("ERROR GET MEDIA ASSETS: ", error);
        setLoading(false);
      }
    };

    const getSessionData = async () => {
      const session = await getSession();
      setIsAdminRole(session?.user?.role === "ADMIN");
      setIsGuestRole(session === null || session === undefined);
    };

    getSessionData();
    getProduct();
    getVariants();
    getMediaAssets();
  }, []);

  const handleBuying = () => {
    if (isAdminRole) {
      toast.error("Anda tidak bisa memesan produk sebagai admin!");
    } else if (isGuestRole) {
      router.push(
        `/auth/sign-in/?callbackUrl=http%3A%2F%2Flocalhost%3A3000${pathname}`
      );
      toast("Login terlebih dahulu untuk memesan produk!", {
        icon: "🔒",
      });
    } else {
      setIsBuying(true);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-[66vh]">
      {loading && (
        <p className="animate-blink w-full text-xl text-center text-primary font-semibold pt-20 col-span-2">
          Memuat produk...
        </p>
      )}
      {Object.keys(product).length > 0 && !loading && (
        <>
          <div className="h-full">
            <Swiper
              spaceBetween={10}
              navigation={true}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[FreeMode, Navigation, Thumbs]}
              style={{
                "--swiper-navigation-color": "#FFFFFF",
                "--swiper-navigation-size": "36px",
              }}
              className="h-[50vh] w-full rounded-3xl shadow-lg shadow-[#151515]/60"
            >
              {mediaAssets.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="flex h-[50vh] w-full items-center justify-center relative">
                    <Image
                      src={image.mediaURL}
                      alt="product-image"
                      className="block h-full w-full object-cover"
                      layout="fill"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnail */}
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={3}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="thumbs mt-3 h-32 w-full rounded-3xl swiper-thumbnail shadow-lg shadow-[#151515]/60"
            >
              {mediaAssets.map((image, index) => (
                <SwiperSlide
                  key={index}
                  className="shadow-lg shadow-[#151515]/60"
                >
                  <button className="flex h-32 relative w-full items-center justify-center">
                    <Image
                      src={image.mediaURL}
                      alt="product-image"
                      className="block h-full w-full object-cover"
                      layout="fill"
                    />
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="flex flex-col h-full justify-between gap-4 w-full text-[#151515]">
            <div className="flex flex-col gap-5">
              <p className="text-5xl font-bold capitalize">
                {product.productName}
              </p>
              <p className="text-base text-justify">{product.description}</p>
            </div>
            <div className="flex flex-col gap-4">
              {variants.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-xl">Varian</p>
                  <div className="grid grid-cols-3 gap-2">
                    {variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`${
                          variant.id === selectedVariant?.id
                            ? "bg-primary"
                            : "bg-[#151515]"
                        } text-sm flex rounded-xl shadow-lg capitalize shadow-[#151515]/60 text-main_bg gap-2 justify-between hover:scale-105 active:scale-100 duration-200 py-2 px-4`}
                      >
                        <p>{variant.variantName}</p>
                        <p>
                          +
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(variant.additionalPrice)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div
                className={`${
                  product.discount ? "items-center h-32" : "items-end py-8"
                } bg-[#151515] shadow-lg shadow-[#151515]/60 text-main_bg flex justify-between px-6 rounded-3xl`}
              >
                <div className="flex flex-col gap-2 text-xl font-bold">
                  <p
                    className={`${
                      product.discount
                        ? "line-through text-lg opacity-80"
                        : "text-5xl font-bold"
                    }`}
                  >
                    {new Intl.NumberFormat("id", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(product.price)}
                  </p>
                  {product.discount > 0 && (
                    <p className={`text-2xl`}>
                      {new Intl.NumberFormat("id", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(
                        product.price - (product.price * product.discount) / 100
                      )}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {product.discount > 0 && (
                    <p className="text-2xl font-bold">
                      DISKON {product.discount}%
                    </p>
                  )}
                  <p className="font-medium">{product.stock} stok tersedia</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2 pb-20">
            <button
              onClick={handleBuying}
              className="bg-primary hover:bg-dark_primary duration-200 hover:scale-[1.01] active:scale-100 w-full text-main_bg font-bold py-6 text-xl rounded-3xl shadow-lg shadow-[#151515]/60"
            >
              Pesan Sekarang
            </button>
          </div>
          {isBuying && (
            <CardOrder
              product={product}
              closeModal={() => setIsBuying(false)}
              variants={variants}
              selectedVariant={selectedVariant}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DetailMenu;

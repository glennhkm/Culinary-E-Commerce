import { CircleX, Plus, Utensils, X } from "lucide-react";
import Image from "next/legacy/image";
import React, { useState } from "react";
import { FeaturedImageUpload } from "../../uploadthing/dropzoneFeaturedImage";
import { v4 as uuidv4 } from "uuid";
import { ImageUpload } from "../../uploadthing/dropzoneImage";
import toast from "react-hot-toast";
import axios from "axios";
import { deleteImage } from "@/lib/uploadthing/deleteImage";

export const CardAddProduct = ({ closeModal, categories, updateTrigger }) => {
  let [productData, SetProductData] = useState({ bestSeller: false });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [images, setImages] = useState(new Array(2).fill(null));
  const [variants, setVariants] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!featuredImage || images.includes(null)){
      toast.error("Please Add All Images");
      return;
    }
    const id = uuidv4();
    productData = {
      ...productData,
      id,
      stock: parseInt(productData.stock, 10),
      discount: parseInt(productData.discount, 10),
      price: parseInt(productData.price, 10),
    };
    const variantData = variants.map((item) => {
      return {
        variantName: item.variantName,
        additionalPrice: item.additionalPrice ? parseInt(item.additionalPrice, 10) : 0,
        idProduct: productData.id,
      };
    });
    const data = {
      productData,
      assets: {
        featuredImage,
        images,
      },
      variantData,
    };
    try { 
      const response = await axios.post("/api/product", data);
      if (response.status === 200 || response.status === 201) {
        toast.success("Berhasil menambahkan produk!");
        updateTrigger();
        closeModal();
      }
    } catch (error) {
      toast.error("Gagal menambahkan produk!");
      console.log("error: ", error);
    }
  };

  const handleImage = async (url, key, index) => {
    const lastImage = images[index]?.key;
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = { url, key };
      return newImages;
    });
    lastImage && (await deleteImage(lastImage));
  };

  const handleAddVariants = () => {
    setVariants((prev) => [...prev, {variantName: "", additionalPrice: ""}]);
  }

  const handleChangeVariantName = (e, index) => {
    const newVariants = [...variants];
    newVariants[index].variantName = e.target.value;
    setVariants(newVariants);
  }

  const handleChangeVariantPrice = (e, index) => {
    const newVariants = [...variants];
    newVariants[index].additionalPrice = e.target.value;
    setVariants(newVariants);
  }

  const handleDeleteVariant = (index) => {
    setVariants((prev) => {
      const newVariants = [...prev];
      newVariants.splice(index, 1);
      return newVariants;
    });
  }

  return (
    <div className="w-screen h-screen bg-black/40 fixed top-0 left-0 flex flex-col justify-center items-center z-[1000]">
      <div className="w-1/2 flex justify-end -mb-4 -mr-5 relative z-[1001]">
        <button className="duration-100 hover:scale-110" onClick={closeModal}>
          <CircleX size={30} fill="#7D0A0A" className="text-[#151515]" />
        </button>
      </div>
      <div className="bg-[#151515] h-[86vh] overflow-x-hidden z-[1] scrollbar-thumb-rounded-full scrollbar-thin scrollbar-track-rounded-full scrollbar-thumb-main_bg/40 scrollbar-track-main_bg/5 w-1/2 rounded-xl shadow-xl shadow-black flex flex-col items-center py-12 px-8 gap-6 border-[0.1px] border-main_bg/30 relative">
        <div className="flex w-full justify-between items-center h-16">
          <div className="w-24 h-24 relative -ml-3">
            <Image
              src={"/images/main-logo.png"}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex gap-3 pr-2">
            <Utensils size={32} className="text-main_bg" />
            <h2 className="font-bold text-3xl text-main_bg">TAMBAH PRODUK</h2>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3 items-center">
          <div action="" className="w-[36vh] h-[36vh] relative">
            <FeaturedImageUpload
              className={`absolute h-full w-full -top-2 left-0 ${
                featuredImage &&
                "opacity-0 z-50 hover:bg-black/60 hover:opacity-100"
              }`}
              onChange={async (url, key) => {
                const lastFeaturedImage = featuredImage?.key;
                setFeaturedImage({url, key});
                lastFeaturedImage && (await deleteImage(lastFeaturedImage));                
              }}
            />
            {featuredImage && (
              <Image
                src={featuredImage.url}
                layout="fill"
                objectFit="cover"
                className="rounded-xl"
              />
            )}
          </div>
          <p className="text-white text-sm font-semibold">Gambar Utama</p>
        </div>
        <div className="flex gap-8 mb-2 w-full h-full justify-center">
          {images.map((img, i) => (
            <div className="flex flex-col items-center w-1/3 gap-2.5">
              <div action="" className="h-[28vh] w-[28vh] relative">
                <ImageUpload
                  className={`absolute h-full w-full -top-2 left-0 ${
                    img && "opacity-0 z-50 hover:bg-black/60 hover:opacity-100"
                  }`}
                  onChange={(url, key) => {
                    handleImage(url, key, i);
                  }}
                />
                {img && (
                  <Image
                    src={img.url}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                )}
              </div>
              <p className="text-white text-sm font-semibold">Gambar {i + 1}</p>
            </div>
          ))}
        </div>
        <form
          action=""
          className="grid grid-cols-2 gap-3 w-full"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={productData.productName}
            required
            placeholder="Nama Produk"
            onChange={(e) =>
              SetProductData((prev) => ({
                ...prev,
                productName: e.target.value,
              }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent"
          />
          <div className="w-full flex bg-white gap-2 p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent">
            <p>Rp.</p>
            <input
              type="number"
              value={productData.price}
              required
              placeholder="Harga"
              onChange={(e) =>
                SetProductData((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
              className="focus:outline-none remove-arrow"
            />
          </div>
          <textarea
            type="text"
            value={productData.description}
            required
            placeholder="Deskripsi"
            onChange={(e) =>
              SetProductData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full p-3 border col-span-2 border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent"
          />
          <input
            type="number"
            value={productData.stock}
            required
            placeholder="Stok"
            onChange={(e) =>
              SetProductData((prev) => ({
                ...prev,
                stock: Number(e.target.value),
              }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent"
          />
          <div className="w-full bg-white p-3 gap-1 flex justify-between border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent">
            <input
              type="number"
              value={productData.discount}
              placeholder="Diskon"
              onChange={(e) =>
                SetProductData((prev) => ({
                  ...prev,
                  discount: Number(e.target.value),
                }))
              }
              className="focus:outline-none w-full remove-arrow"
            />
            <p>%</p>
          </div>
          <select
            name=""
            id=""
            value={productData.idProductCategory}
            onChange={(e) =>
              SetProductData((prev) => ({
                ...prev,
                idProductCategory: e.target.value,
              }))
            }
            required
            className={`w-full p-3 border col-span-2 border-gray-300 rounded-lg ${
              !productData.idProductCategory ? "text-black/50" : "text-black"
            } focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent`}
          >
            <option value="" disabled selected>
              Pilih Kategori Product
            </option>
            {categories.map((item) => (
              <option value={item.id} className="text-black">
                {item.categoryName}
              </option>
            ))}
          </select>
          <div className="col-span-2">
            <button type="button" onClick={handleAddVariants} className="bg-[#151515] hover:bg-black duration-200 mb-3 text-main_bg rounded-xl w-auto p-3 text-sm flex gap-2 shadow-md shadow-black border-[0.16px] border-main_bg">
              <Plus size={20}/>
              Tambah Varian
            </button>
            {variants.length > 0 && (
              <div className="flex flex-col gap-2.5">
                {variants.map((variant, index) => (
                  <div className="flex justify-between gap-2 text-black rounded-xl items-center w-full" key={index}>
                    <input required type="text" className="focus:outline-none text-sm w-full rounded-xl py-2 pr-1 pl-3" placeholder={`Varian ${index + 1}`} value={variant.variantName} onChange={(e) => handleChangeVariantName(e, index)} />
                    <div className="flex gap-2 text-sm w-full rounded-xl py-2 pr-1 pl-3 bg-white">
                      <p>Rp. </p>
                      <input type="number" className="focus:outline-none remove-arrow bg-transparent w-full" placeholder={`Harga Tambahan Varian ${index + 1}`} value={variant.additionalPrice} onChange={(e) => handleChangeVariantPrice(e, index)} />                    
                    </div>
                    <button type="button" className="bg-primary rounded-full text-white p-1 duration-200 hover:bg-dark_primary" onClick={() => handleDeleteVariant(index)}>
                      <X size={10}/>
                    </button>
                  </div>
                ))}
            </div>
            )}
          </div>
          <div className="col-span-2">
            <div className="flex gap-2 px-[0.16rem]">
              <input type="checkbox" value={productData.bestSeller} onChange={() => SetProductData((prev) => ({
                  ...prev,
                  bestSeller: !productData.bestSeller,
                }))}/>
              <p className="text-sm text-main_bg">Tandai sebagai produk terlaris</p>
            </div>
          </div>
          <button
            type="submit"
            className="w-full text-main_bg bg-primary col-span-2 hover:text-primary hover:bg-main_bg shadow-lg shadow-black/60 duration-200 flex gap-1 items-center justify-center font-semibold tracking-wide rounded-lg p-3"
          >
            <Plus size={20} />
            <p>Tambahkan</p>
          </button>
        </form>
      </div>
    </div>
  );
};

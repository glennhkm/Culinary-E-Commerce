import { dataUser } from "@/lib/sessionManagement/sessionCheck";
import axios from "axios";
import { set } from "date-fns";
import { CircleX, Utensils } from "lucide-react";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export const CardOrder = ({ closeModal, product, variants, selectedVariant }) => {
  const [variantToBuy, setVariantToBuy] = useState(selectedVariant);
  const [quantity, setQuantity] = useState(1);
  const [userData, setUserData] = useState(null);
  const [payment, setPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [additionalMessage, setAdditionalMessage] = useState("");
  const variantRef = useRef(null);
  const router = useRouter();
  const [totalPrice, setTotalPrice] = useState(() => {
    if (product.discount) {
      return ((product.price * quantity) + (variantToBuy ? variantToBuy.additionalPrice : 0)) - ((product.price * quantity) * product.discount / 100);
    }
    return (product.price * quantity) + (variantToBuy ? variantToBuy.additionalPrice : 0);
  });

  useEffect(() => {
    const getPaymentMethod = async () => {
      try {
        const response = await axios.get("/api/paymentMethod");
        if (response.status === 200) {
          setPaymentMethod(response.data);
        }
      } catch (error) {
        console.log("ERROR GET PAYMENT METHOD: ", error);
      }
    }

    setUserData(dataUser());
    getPaymentMethod();
  }, [])

  const handleChangeUserData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }

  const handleChangeQuantity = (e) => {
    if (e.target.value < 1) {
      setQuantity(1);
      return;
    } 
    if (e.target.value > product.stock) {
      setQuantity(product.stock);
      return;
    }
    setQuantity(e.target.value);
    if (product.discount) {
      setTotalPrice(((product.price * e.target.value) + (variantToBuy ? variantToBuy.additionalPrice : 0)) - (((product.price * e.target.value) + (variantToBuy ? variantToBuy.additionalPrice : 0)) * product.discount / 100));
    } else {
      setTotalPrice((product.price * e.target.value) + (variantToBuy ? variantToBuy.additionalPrice : 0));
    }
  }

  const handleVariantToBuy = (variant) => {
    if (product.discount) {
      setTotalPrice(((product.price * quantity) + (variant?.additionalPrice)) - (((product.price * quantity) + (variant?.additionalPrice)) * product.discount / 100));
    } else {
      setTotalPrice((product.price * quantity) + (variant?.additionalPrice));
    }
    setVariantToBuy(variant);
  }

  const handleOrder = async (e) => {
    e.preventDefault();
    if (variants.length > 0 && !variantToBuy) {
      variantRef.current.scrollIntoView({ behavior: "smooth" });
      toast("Pilih varian terlebih dahulu", {
        icon: "🛍️",
      })
      return;
    }
    const toastId = toast.loading("Memproses Pesanan...");
    try {
      const paymentMethodSelected = paymentMethod.find((item) => item.id === payment);
      const transactionData = {
        idProduct: product.id,
        idUser: userData?.id,
        idPaymentMethod: payment,
        idVariant: (variants.length > 0 ? variantToBuy?.id : null),
        fullName: userData?.fullName,
        phoneNumber: userData?.phoneNumber,
        address: userData?.address,
        quantity: parseInt(quantity),
        additionalMessage,
        status: paymentMethodSelected.noRekening.trim() === null || paymentMethodSelected.noRekening.trim() === "" ? "MENUNGGU_APPROVAL" : "MENUNGGU_PEMBAYARAN",
        totalPrice,
      }
      const response = await axios.post("/api/transaction", transactionData);
      if (response.status === 200) {
        toast.dismiss(toastId);
        toast.success("Pesanan berhasil");        
        if (paymentMethodSelected.noRekening.trim() === null || paymentMethodSelected.noRekening.trim() === "") {
          router.push("/akun-pesanan?konfirmasi=proses");
        } else {
          router.push("/akun-pesanan?konfirmasi=true");
        }
        closeModal();
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.log("ERROR ORDER: ", error);
      toast.error("Pesanan gagal");
    }
  }

  return (
    <div className="w-screen h-screen bg-black/60 fixed top-0 left-0 flex flex-col justify-center items-center z-[1000] text-main_bg">
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
            <Utensils size={32} className="" />
            <h2 className="font-bold text-3xl">PESAN PRODUK</h2>
          </div>
        </div>
        <p className="text-5xl text-start w-full font-bold capitalize" ref={variantRef}>{product.productName}</p>
        <form action="" className="grid grid-cols-2 gap-4 w-full" onSubmit={handleOrder}>
          {variants.length > 0 && (
            <div className={`flex flex-col gap-2 col-span-2`}>
              <p className="font-bold text-base">Varian</p>
              <div className="grid grid-cols-3 gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => handleVariantToBuy(variant)}
                    className={`${variant.id === variantToBuy?.id ? "bg-primary text-main_bg" : "bg-main_bg text-[#151515]"} border-[0.3px] border-black rounded-xl shadow-lg capitalize shadow-black flex justify-between gap-2 text-sm  hover:scale-105 active:scale-100 duration-200 py-2 px-4`}>
                    <p>{variant.variantName}</p>
                    <p>+{new Intl.NumberFormat("id", {
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
          <div className="flex flex-col gap-2">            
            <label htmlFor="quantity" className="font-bold text-base">Jumlah</label>        
            <div className="flex items-end gap-4 w-full">
                <input value={quantity} onChange={(e) => handleChangeQuantity(e)} type="number" name="quantity" id="quantity" className="rounded-xl py-2 text-black px-3 focus:outline-none w-20"/>
                <p className="text-sm">{product.stock} stok tersedia</p>
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-2 mt-1 text-black">
            <label htmlFor="address" className="font-bold text-base text-main_bg">Catatan Tambahan untuk Penjual</label>
            <textarea name="address" id="address" placeholder="Tambahkan Catatan untuk Penjual atau pesan sesuai keinginanmu..." className="rounded-xl focus:ring-primary border border-gray-300 focus:ring-2 p-3 focus:outline-none h-24" value={additionalMessage} onChange={(e) => setAdditionalMessage(e.target.value)}/>
          </div>
          <div className="col-span-2 flex flex-col gap-2 mt-1 text-black">
            <label htmlFor="fullName" className="font-bold text-base text-main_bg">Nama Lengkap</label>
            <input name="fullName" id="fullName" className="rounded-xl focus:ring-primary border border-gray-300 focus:ring-2 p-3 focus:outline-none" value={userData?.fullName} onChange={(e) => handleChangeUserData(e)}/>
          </div>
          <div className="col-span-2 flex flex-col gap-2 mt-1 text-black">
            <label htmlFor="phoneNumber" className="font-bold text-base text-main_bg">Nomor Telepon</label>
            <input name="phoneNumber" id="phoneNumber" className="rounded-xl focus:ring-primary border border-gray-300 focus:ring-2 p-3 focus:outline-none" value={userData?.phoneNumber} onChange={(e) => handleChangeUserData(e)}/>
          </div>
          <div className="col-span-2 flex flex-col gap-2 mt-1 text-black">
            <label htmlFor="address" className="font-bold text-base text-main_bg">Alamat Detail</label>
            <textarea name="address" id="address" className="rounded-xl focus:ring-primary border border-gray-300 focus:ring-2 p-3 focus:outline-none h-24" value={userData?.address} onChange={(e) => handleChangeUserData(e)}/>
          </div>
          <div className="col-span-2 flex flex-col gap-2 mt-1">
            <label htmlFor="payment" className="font-bold text-base text-main_bg">Metode Pembayaran</label>
            <select
              name="payment"
              id="payment"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              required
              className={`w-full p-3 border rounded-xl ${!payment ? "text-black/50" : "text-black"} focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 focus:border-transparent`}>
              <option value="" disabled selected>
                Pilih Metode Pembayaran
              </option>
              {paymentMethod.map((item) => (
                <option value={item.id} className="text-black">
                  {item.method}{item.noRekening && ` - ${item.noRekening}`}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-[#151515] border-[0.2px] border-main_bg rounded-xl mt-2 col-span-2 shadow-lg shadow-black px-4 py-6 flex justify-between items-center">
            <div className="flex gap-3 items-center">     
              <div className="flex flex-col gap-2">
                  <p><span className="capitalize">{product.productName}</span> {` x ${quantity}`}</p>  
                  <p>Varian <span className="capitalize">{variantToBuy?.variantName}</span></p>
                  {product.discount > 0 && (
                    <p>Diskon</p>
                  )}
              </div>     
              <div className="flex flex-col gap-2">
                <p>: {new Intl.NumberFormat("id", {
                    "style": "currency",
                    "currency": "IDR",
                    "minimumFractionDigits": 0
                  }).format(product.price * quantity)}
                </p>
                <p>: {new Intl.NumberFormat("id", {
                      "style": "currency",
                      "currency": "IDR",
                      "minimumFractionDigits": 0
                    }).format((variantToBuy ? variantToBuy.additionalPrice : 0))}
                </p>
                {product.discount > 0 && (
                  <p>: {product.discount}%</p>
                )}
              </div>
            </div>
            <p className="font-bold text-5xl">{new Intl.NumberFormat("id", {
                "style": "currency",
                "currency": "IDR",
                "minimumFractionDigits": 0
            }).format(totalPrice)}</p>
          </div>
          <button className="col-span-2 mt-2 bg-primary font-bold rounded-xl duration-200 hover:scale-[1.01] active:scale-100 hover:bg-dark_primary py-3 text-3xl shadow-lg shadow-black">
            PESAN 
          </button>
        </form>
      </div>
    </div>
  );
};

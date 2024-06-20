import { ImageUpload } from "@/components/uploadthing/dropzoneImage";
import { formatDate } from "@/lib/formatDate/formatDate";
import { deleteImage } from "@/lib/uploadthing/deleteImage";
import axios from "axios";
import { CircleAlert, CircleX, HandCoins, Pencil, Save, X } from "lucide-react";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const PaymentConfirm = ({ updateTrigger, closeModal, transaction }) => {
  const [image, setImage] = useState(null);
  const [idPaymentMethod, setIdPaymentMethod] = useState(
    transaction.idPaymentMethod
  );
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isAgreeChecked, setIsAgreeChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isErrorAgreeChecked, setIsErrorAgreeChecked] = useState(false);
  const [isUpdatingPaymentMethod, setIsUpdatingPaymentMethod] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getPaymentMethod = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/paymentMethod");
        if (response.status === 200) {
          setPaymentMethods(response.data);
        }
      } catch (error) {
        console.log("ERROR GET PAYMENT METHOD: ", error);
      } finally {
        setLoading(false);
      }
    };
    getPaymentMethod();
  }, []);

  const handleImage = async (url, key) => {
    const lastImageKey = image && image.key;
    setImage({ key, url });
    lastImageKey && (await deleteImage(lastImageKey));
  };

  const handleSavePaymentMethod = async () => {
    const toastId = toast.loading("Memproses...");
    const paymentMethodSelected = paymentMethods.find((item) => item.id === idPaymentMethod);
    try {
      const response = await axios.patch(`/api/transaction/${transaction.id}`, {
        idPaymentMethod,
      });
      if (response.status === 200) {
        toast.dismiss(toastId); 
        toast.success("Metode Pembayaran Berhasil Diperbarui");
        setIsUpdatingPaymentMethod(false);
        updateTrigger();
        if(paymentMethodSelected?.noRekening.trim() === null || paymentMethodSelected?.noRekening.trim() === ""){
          closeModal();
          router.refresh();
          return;
        }
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.log("ERROR UPDATE PAYMENT METHOD: ", error.message);
      toast.error("Metode Pembayaran Gagal Diperbarui");
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      toast.error("Mohon unggah bukti pembayaran!");
      return;
    }
    if (!isAgreeChecked) {
      setIsErrorAgreeChecked(true);
      return;
    }
    if (!idPaymentMethod) {
      toast.error("Mohon pilih metode pembayaran!");
      return;
    }
    try {
      const data = {
        idTransaction: transaction.id,
        imageURL: image.url,
        imageKey: image.key,
      };
      const response = await axios.post("/api/paymentConfirm", data);
      if (response.status === 200) {
        toast.success("Pembayaran berhasil dikonfirmasi");
        updateTrigger();
        closeModal();
      }
    } catch (error) {
      console.log("ERROR KONFIRMASI: ", error.message);
      toast.error("Gagal mengonfirmasi pembayaran!");
    }
  };

  return (
    <div className="w-screen h-screen bg-black/60 fixed top-0 left-0 flex flex-col justify-center items-center z-[1000] text-main_bg">
      <div className="w-2/3 flex justify-end -mb-4 -mr-5 relative z-[1001]">
        <button className="duration-100 hover:scale-110" onClick={closeModal}>
          <CircleX size={30} fill="#7D0A0A" className="text-[#151515]" />
        </button>
      </div>
      <div className="bg-[#151515] h-[80vh] overflow-x-hidden z-[1] scrollbar-thumb-rounded-full scrollbar-thin scrollbar-track-rounded-full scrollbar-thumb-main_bg/40 scrollbar-track-main_bg/5 w-2/3 rounded-xl shadow-xl shadow-black flex flex-col items-center pt-12 pb-8 px-8 gap-6 border-[0.1px] border-main_bg/30 relative">
        <div className="flex w-full justify-between items-center h-16">
          <div className="w-24 h-24 relative -ml-3">
            <Image
              src={"/images/main-logo.png"}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex gap-3 pr-2">
            <HandCoins size={32} className="" />
            <h2 className="font-bold text-3xl">KONFIRMASI PEMBAYARAN</h2>
          </div>
        </div>
        <div className="flex flex-col w-full gap-4">
          <div className="flex w-full gap-4">
            <div className="flex flex-col gap-3 items-center">
              <div action="" className="h-full w-[38vh] relative">
                <ImageUpload
                  className={`absolute h-full w-full -top-2 left-0 ${
                    image &&
                    "opacity-0 z-50 hover:bg-black/60 hover:opacity-100"
                  }`}
                  onChange={(url, key) => {
                    handleImage(url, key);
                  }}
                />
                {image && (
                  <Image
                    src={image.url}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-xl"
                  />
                )}
              </div>
              <div>
                <p className="text-lg text-main_bg font-semibold">
                  Unggah Bukti Pembayaran
                </p>
                <p className="text-xs font-thin">
                  Dapat berupa screenshoot bukti pengiriman atau sejenisnya
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-3 w-full">
              <div className="bg-[#151515] border-[0.2px] gap-8 relative border-main_bg w-full h-auto rounded-xl mt-2 col-span-2 shadow-lg shadow-black px-4 pt-10 pb-6 flex flex-col justify-between">
                <div className="absolute top-1 right-1">
                  <Image src={"/images/main-logo.png"} width={76} height={76} />
                </div>
                <div className="flex gap-3 items-center w-full">
                  <div className="grid grid-cols-2 gap-2 h-full w-full">
                    <p className="text-lg mb-1 font-bold col-span-2">Biodata Pemesan</p>
                    <p>Nama Lengkap</p>
                    <p className="">: {transaction.fullName}</p>
                    <p>No. Hp</p>
                    <p className="">: {transaction.phoneNumber}</p>
                    <p>Alamat</p>
                    <p className="">:</p>
                    <p className="col-span-2">{transaction.address}</p>
                    {transaction.product && (
                      <p className="text-lg mt-2 mb-1 font-bold col-span-2">Produk </p>
                    )}                  
                    {!transaction.product ? (
                      <p className="col-span-2 font-bold text-xl mt-2 mb-1">
                        Produk sudah tidak tersedia
                      </p>
                    ) : (
                      <>
                        <p>
                          <span className="capitalize">
                            {transaction.product.productName}
                          </span>{" "}
                          {` x ${transaction.quantity}`}
                        </p>
                        <p>
                          :{" "}
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(
                            transaction.product.price * transaction.quantity
                          )}
                        </p>
                        <p>
                          Varian{" "}
                          <span className="capitalize">
                            {transaction.variant?.variantName}
                          </span>
                        </p>
                        <p>
                          :{" "}
                          {new Intl.NumberFormat("id", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(
                            transaction.variant
                              ? transaction.variant.additionalPrice
                              : 0
                          )}
                        </p>
                        {transaction.product.discount > 0 && <p>Diskon</p>}
                        {transaction.product.discount > 0 && (
                          <p>: {transaction.product.discount}%</p>
                        )}
                    </>
                    )} 
                    {transaction.product.discount > 0 && <p>Diskon</p>}
                    {transaction.product.discount > 0 && (
                      <p>: {transaction.product.discount}%</p>
                    )}
                    <p>Metode Pembayaran</p>
                    <p>: {transaction.paymentMethod?.method}</p>
                    <p>Tanggal Pemesanan</p>
                    <p>: {formatDate(transaction.orderDate)}</p>
                    <p>Catatan Tambahan</p>
                    <p>: {transaction.additionalMessage || "-" }</p>
                  </div>                
                </div>
                <p className="font-bold text-5xl text-center">
                  {new Intl.NumberFormat("id", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(transaction.totalPrice)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <label
                htmlFor="paymentMethod"
                className="font-semibold text-lg text-main_bg"
              >
                Metode Pembayaran
              </label>
              <div
                className={`flex gap-2 ${
                  isUpdatingPaymentMethod && "flex-col"
                }`}
              >
                <select
                  name="payment"
                  id="payment"
                  disabled={!isUpdatingPaymentMethod}
                  value={idPaymentMethod}
                  onChange={(e) => setIdPaymentMethod(e.target.value)}
                  required
                  className={`w-full p-3 border rounded-xl ${
                    !idPaymentMethod ? "text-black/50" : "text-black"
                  } focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 focus:border-transparent`}
                >
                  <option value="" disabled selected>
                    {loading ? "Memuat..." : "Metode Pembayaran"}
                  </option>
                  {paymentMethods.map((item) => (
                    <option value={item.id} className="text-black">
                      {item.method}
                      {item.noRekening && ` - ${item.noRekening}`}
                    </option>
                  ))}
                </select>
                {isUpdatingPaymentMethod ? (
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={handleSavePaymentMethod}
                      className="bg-main_bg rounded-xl border-[0.1px] w-1/6 border-black shadow-lg shadow-black py-2 justify-center hover:bg-opacity-60 duration-200 text-[#151515] flex gap-1 items-center text-sm font-medium"
                    >
                      <Save size={16} />
                      <p>Simpan</p>
                    </button>
                    <button
                      className="bg-[#151515] border-[0.1px] w-1/6 border-main_bg/40 rounded-xl shadow-lg shadow-black py-2 justify-center hover:bg-black/40 duration-200 flex gap-1 items-center text-sm font-medium"
                      onClick={() => setIsUpdatingPaymentMethod(false)}
                    >
                      <X size={16} />
                      <p>Batal</p>
                    </button>
                  </div>
                ) : (
                  <button
                    className="bg-[#151515] border-[0.1px] border-main_bg/40 shadow-lg shadow-black rounded-xl px-4 hover:bg-black/40 duration-200"
                    onClick={() => setIsUpdatingPaymentMethod(true)}
                  >
                    <Pencil size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="checkbox"
              checked={isAgreeChecked}
              onChange={() => setIsAgreeChecked((prev) => !prev)}
              name="agreePayment"
              id="agreePayment"
              required
              className="cursor-pointer bg-transparent border-main_bg/40 border-[0.16px]"
            />
            <p className="text-xs font-thin">
              Anda tidak dapat membatalkan pesanan ketika sudah membayar
            </p>
          </div>
          {isErrorAgreeChecked && (
            <div className="flex gap-1 text-secondary -mt-2">
              <CircleAlert size={16} />
              <p className="text-xs">Mohon centang persetujuan</p>
            </div>
          )}
          <button
            onClick={handleSubmit}
            className="py-4 bg-primary rounded-xl font-semibold w-full hover:bg-dark_primary duration-200 active:scale-[0.98]"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
};

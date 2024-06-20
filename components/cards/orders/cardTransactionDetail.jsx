import { formatDate } from "@/lib/formatDate/formatDate";
import { checkUserRole } from "@/lib/sessionManagement/sessionCheck";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import axios from "axios";
import { se } from "date-fns/locale";
import { CircleAlert, CircleX, HandCoins, Pencil, Save, X } from "lucide-react";
import Image from "next/legacy/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const CardTransactionDetail = ({ updateTrigger, closeModal, transaction }) => {
  const [image, setImage] = useState(null);
  const [isAdminRole, setIsAdminRole] = useState(null);
  const [isUserRole, setIsUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isErrorDeleteMessage, setIsErrorDeleteMessage] = useState(false);

  useEffect(() => {
    const getPaymentConfirmation = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/paymentConfirm/${transaction.id}`);
        if (response.status === 200) {
          setIsLoading(false);
          setImage(response.data);
        }
      } catch (error) {
        setIsLoading(false);
        console.log("ERROR GET PAYMENT CONFIRMATION: ", error.message);
      }
    }

    const setRole = async () => {
      const roleData = await checkUserRole();
      setIsAdminRole(roleData?.isAdmin);
      setIsUserRole(roleData?.isUser);
    }

    setRole();
    getPaymentConfirmation();
  }, []);

  const handleClickKelolaPesanan = async (status) => {
    if (status === "DIBATALKAN" && !deleteMessage) {
      setIsErrorDeleteMessage(true);
      return;
    }
    const toastLoad = toast.loading("Memproses...");
    try {      
      const message = status === "DIBATALKAN" ? deleteMessage : null;
      const response = await axios.patch(`/api/transaction/${transaction.id}`, {
        status,
        message,
        transaction
      });
      if (response.status === 200) {
        toast.dismiss(toastLoad);
        toast.success(`Pesanan berhasil ${status === "DIBATALKAN" ? "dibatalkan" : "diterima"}`);
        updateTrigger();
        closeModal();
      }
    } catch (error) {
      console.log("ERROR UPDATE TRANSACTION: ", error.message);
      toast.dismiss(toastLoad);
      toast.error("Gagal menerima pesanan");
    }
  }

  console.log("IS CANCELLING: ", isCancelling);

  return (
    <div className="w-screen h-screen bg-black/60 fixed top-0 left-0 flex flex-col justify-center items-center z-[1000] text-main_bg">
      <div className="w-2/3 flex justify-end -mb-4 -mr-5 relative z-[1001]">
        <button className="duration-100 hover:scale-110" onClick={closeModal}>
          <CircleX size={30} fill="#7D0A0A" className="text-[#151515]" />
        </button>
      </div>
      <div className="bg-[#151515] h-auto max-h-[80vh] overflow-x-hidden z-[1] scrollbar-thumb-rounded-full scrollbar-thin scrollbar-track-rounded-full scrollbar-thumb-main_bg/40 scrollbar-track-main_bg/5 w-2/3 rounded-xl shadow-xl shadow-black flex flex-col items-center pt-12 pb-10 px-8 gap-6 border-[0.1px] border-main_bg/30 relative">
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
            <h2 className="font-bold text-3xl">{ isAdminRole && transaction.status === "MENUNGGU_APPROVAL" ? 'KELOLA PESANAN' : 'DETAIL PESANAN' }</h2>
          </div>
        </div>
        <div className="flex w-full gap-4">
          {transaction.paymentMethod?.noRekening.trim() && (
            <div className="flex flex-col gap-3 items-center h-full">
              <div action="" className="h-full w-[38vh] relative">
                {image && (
                  <Image
                  src={image?.imageURL}
                  layout="fill"
                  objectFit="contain"
                  className="rounded-xl"
                  />
                )}
                {isLoading && (
                  <div className="w-full h-full rounded-xl border border-main_bg/40 border-dashed flex justify-center items-center">
                    <p className="text-main_bg animate-blink text-sm">Memuat Gambar...</p>
                  </div>
                )}
              </div>
              <p className="text-lg text-center text-main_bg font-semibold">
                Bukti Pembayaran
              </p>
              <p className={`text-center text-main_bg ${transaction.paymentMethod?.method ? 'font-semibold text-xl' : 'font-normal text-base' }`}>
                {transaction.paymentMethod?.method || 'Metode Pembayaran sudah tidak tersedia'}
              </p>
            </div>
          )}
          <div className="flex flex-col justify-between gap-3 w-full">
            <div className="bg-[#151515] border-[0.2px] gap-8 h-full relative border-main_bg w-full rounded-xl mt-2 col-span-2 shadow-lg shadow-black px-4 py-6 flex flex-col justify-between">
              <div className="absolute top-1 right-1">
                <Image
                  src={"/images/main-logo.png"}
                  width={76}
                  height={76}
                />
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
                  <p>Metode Pembayaran</p>
                  <p>: {transaction.paymentMethod?.method || 'Metode pembayaran sudah tidak tersedia'}</p>
                  <p>Tanggal Pemesanan</p>
                  <p>: {formatDate(transaction.orderDate)}</p>
                  <p>Tanggal Pembayaran</p>
                  <p>: {formatDate(transaction.paymentDate)}</p>
                  <p>Catatan Tambahan</p>
                  <p>: {transaction.additionalMessage || "-" }</p>
                </div>                
              </div>
              <p className="font-bold text-5xl text-center">{new Intl.NumberFormat("id", {
                      "style": "currency",
                      "currency": "IDR",
                      "minimumFractionDigits": 0
                  }).format(transaction.totalPrice)}
              </p>
            </div>
            {((isAdminRole && transaction.status === "MENUNGGU_APPROVAL") || (isUserRole && !transaction.paymentMethod?.noRekening)) && (
              <div className="flex flex-col text-main_bg w-full gap-3 mt-3 font-semibold">
                {isAdminRole && (
                  <button onClick={() => handleClickKelolaPesanan("DIKIRIM")} className="bg-green-600 font-semibold shadow-lg shadow-black rounded-xl w-full py-3 hover:bg-opacity-60 duration-200 active:scale-[0.98]">
                    Terima Pesanan
                  </button>            
                )}
                <div onClick={() => setIsCancelling(true)} className={`${isCancelling ? 'bg-transparent border-[0.16px] border-main_bg/40' : 'bg-primary text-center hover:bg-opacity-60 active:scale-[0.98]'} shadow-lg shadow-black cursor-pointer px-3 transition-all flex flex-col gap-2 rounded-xl w-full py-3 duration-200`}>
                  {isCancelling ? (
                    <div className="flex flex-col gap-2 ">
                      <input type="text" value={deleteMessage} onChange={(e) => setDeleteMessage(e.target.value)} placeholder="Tambahkan keterangan penolakan/pembatalan..." required className="font-normal focus:outline-none px-3 text-[#151515] text-xs rounded-xl w-full py-3"/>
                      {isErrorDeleteMessage && (
                        <div className="flex gap-2 items-center text-secondary">
                          <CircleAlert size={20}/>
                          <p className="text-xs font-normal">Keterangan tidak boleh kosong</p> 
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button onClick={(e) => {
                            e.stopPropagation();
                            setIsCancelling(false);
                          }} className="w-full bg-main_bg text-[#151515] hover:bg-opacity-60 active:scale-[0.98] rounded-xl py-3 duration-200">
                          Kembali
                        </button>
                        <button onClick={() => handleClickKelolaPesanan("DIBATALKAN")} className="bg-primary font-semibold hover:bg-opacity-60 active:scale-[0.98] rounded-xl w-full py-3 duration-200">
                          Tolak/Batalkan Pesanan
                        </button>
                      </div>
                    </div>
                  ) : ('Tolak/Batalkan Pesanan')}
                </div>            
              </div>
            )}
            {(transaction.status === "DIKIRIM" && isUserRole) && (
              <Dropdown className="outline-none focus:outline-none bg-transparent">
                <DropdownTrigger className="focus:outline-none focus:ring-0 ring-0 outline-none">
                  <button className={`bg-green-600 active:scale-[0.98] text-main_bg py-4 mt-2 font-bold rounded-xl w-full px-2 shadow-md shadow-black/40 text-base hover:bg-opacity-60 duration-200`}>Konfirmasi Pesanan Telah Sampai</button>
                </DropdownTrigger>
                <DropdownMenu className="bg-[#151515] border-[0.16px] border-main_bg/40 rounded-xl outline-none ring-0 w-full p-4">
                  <DropdownItem className="hover:bg-[#151515] border-none ring-0 outline-none w-full">
                    <div className="flex flex-col items-center gap-2 w-full">
                      <p className="text-main_bg">Anda yakin pesanan anda sudah sampai?</p>
                      <div className="flex gap-2 justify-center w-3/4 mt-2">
                        <button onClick={() => handleClickKelolaPesanan("SELESAI")} className="bg-green-600 rounded-xl px-2 text-main_bg py-2 w-full text-xs hover:bg-opacity-60 duration-200 active:scale-[0.98]">Konfirmasi</button>
                        <button className="bg-main_bg rounded-xl text-[#151515] py-2 w-full text-xs hover:bg-opacity-60 duration-200 active:scale-[0.98]">Batal</button>
                      </div>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

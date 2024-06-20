import { formatDate } from "@/lib/formatDate/formatDate";
import { dataUser, isUser } from "@/lib/sessionManagement/sessionCheck";
import axios from "axios";
import { ArchiveRestore, Ellipsis, Truck } from "lucide-react";
import Image from "next/legacy/image";
import React, { useEffect, useState } from "react";
import { CardTransactionDetail } from "../cards/orders/cardTransactionDetail";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import toast from "react-hot-toast";


export const OnProcess = () => {
  const [transaction, setTransaction] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailTransaction, setDetailTransaction] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [isUserRole, setIsUserRole] = useState(null);
  
  useEffect(() => {
    const getTransaction = async () => {
      const data = dataUser(window);
      setIdUser(data?.id);
      setLoading(true);
      try {
        const response = await axios.get("/api/transaction", {
          params: { status1: "MENUNGGU_APPROVAL", status2: "DIKIRIM", idUser: data?.id },
        });
        if (response.status === 200) {
          const transactionSorted = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
          setTransaction(transactionSorted);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.log("ERROR TRANSACTION: ", error);
      }
    }

    setIsUserRole(isUser(window));
    getTransaction();
  }, [updateTrigger]);

  const handlePesananTelahSampai = async (transaction) => {
    try {
      const response = await axios.patch(`/api/transaction/${transaction.id}`, {
        status: "SELESAI",
        transaction
      })
      if (response.status === 200) {
        toast.success("Pesanan telah sampai, terimakasih telah berbelanja!");
        setUpdateTrigger((prev) => !prev);
      }
    } catch (error) {
      console.log("ERROR KONFIRMASI PESANAN TELAH SAMPAI: ", error.message);
      toast.error("Gagal konfirmasi pesanan!");
    }
  }
  return (
    <div className="flex flex-col w-full scrollbar-thumb-rounded-full scrollbar-thin scrollbar-track-rounded-full scrollbar-thumb-main_bg/40 scrollbar-track-main_bg/5 overflow-y-auto h-[52vh] px-2 overflow-x-hidden">
      {loading && (
        <p className="w-full text-center text-secondary font-semibold animate-blink">
          Memuat Transaksi...
        </p>
      )}
      {transaction.length < 1 && !loading && (
        <p className="w-full text-center text-secondary font-semibold">
          Tidak ada transaksi yang sedang diproses
        </p>
      )}
      {transaction.map((item) => (
        <div
          key={item.id}
          className="w-full mb-6 flex justify-between items-center rounded-xl bg-[#151515] border-[0.2px] border-main_bg shadow-xl shadow-black text-main_bg py-6 chrome-md:py-10 px-6 relative">  
          <p className="absolute top-3 right-3 text-main_bg text-[0.76rem]">
            {formatDate(item.orderDate)}
          </p>
          <div className="w-12 h-12 absolute left-1 top-1">
            <Image
              src="/images/main-logo.png"
              objectFit="cover"
              layout="fill"
            />
          </div>
          <div className="w-full grid grid-cols-4 gap-y-2 text-base text-center font-normal">
            {/* head */}
            <p className="font-bold">Produk</p>
            <p className="font-bold">Metode Pembayaran</p>
            <p className="font-bold">Status</p>
            <p className="font-bold">Total Harga</p>
            {/* body */}
            <p className="text-sm capitalize">{item.product?.productName || 'Produk sudah tidak tersedia'}</p>
            <p className="text-sm">{item.paymentMethod?.method || 'Metode Pembayaran sudah tidak tersedia'}</p>
            <div className={`flex flex-col gap-2 justify-center items-center`}>
              {item.status === "MENUNGGU_APPROVAL" ? (
                <ArchiveRestore size={20} className="text-slate-500"/>
              ) : (
                <Truck size={20} className="text-blue-500"/>
              )}
              <p className={`text-sm capitalize font-semibold ${item.status === "MENUNGGU_APPROVAL" ? 'text-slate-500' : 'text-blue-500'}`}>
                {item.status === "MENUNGGU_APPROVAL" ? "MENUNGGU KONFIRMASI ADMIN" : "DALAM PENGIRIMAN"}
              </p>
            </div>
            <p className="text-sm">
              {Intl.NumberFormat("id", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(item.totalPrice)}
            </p>
          </div>
          <div className="flex gap-4">
            {(item.status === "DIKIRIM" && isUserRole) && (
              <Dropdown className="outline-none focus:outline-none bg-transparent">
                <DropdownTrigger className="focus:outline-none focus:ring-0 ring-0 outline-none">
                  <button className={`bg-green-600 active:scale-[0.98] text-main_bg font-bold rounded-xl w-full px-2 py-2 shadow-md shadow-black/40 text-sm hover:bg-opacity-60 duration-200`}>Konfirmasi Pesanan Telah Sampai</button>
                </DropdownTrigger>
                <DropdownMenu className="bg-[#151515] border-[0.16px] border-main_bg/40 rounded-xl outline-none ring-0 w-full p-4">
                  <DropdownItem className="hover:bg-[#151515] border-none ring-0 outline-none w-full">
                    <div className="flex flex-col items-center gap-2 w-full">
                      <p className="text-main_bg">Anda yakin pesanan anda sudah sampai?</p>
                      <div className="flex gap-2 justify-center w-3/4 mt-2">
                        <button onClick={() => handlePesananTelahSampai(item)} className="bg-green-600 rounded-xl px-2 text-main_bg py-2 w-full text-xs hover:bg-opacity-60 duration-200 active:scale-[0.98]">Konfirmasi</button>
                        <button className="bg-main_bg rounded-xl text-[#151515] py-2 w-full text-xs hover:bg-opacity-60 duration-200 active:scale-[0.98]">Batal</button>
                      </div>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
            <button onClick={() => setDetailTransaction(item)} className="hover:bg-primary/30 duration-200 p-1 rounded-xl">
              <Ellipsis size={26} className="text-main_bg" />
            </button>
          </div>
        </div>
      ))}
      {detailTransaction && (
        <CardTransactionDetail 
          transaction={detailTransaction} 
          closeModal={() => setDetailTransaction(null)} 
          updateTrigger={() => setUpdateTrigger((prev) => !prev)}
        />
      )}
    </div>
  );
};

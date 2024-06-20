import { formatDate } from "@/lib/formatDate/formatDate";
import { dataUser, isAdmin } from "@/lib/sessionManagement/sessionCheck";
import axios from "axios";
import { ArchiveX, Ellipsis, ReceiptText, Trash2 } from "lucide-react";
import Image from "next/legacy/image";
import React, { useEffect, useState } from "react";
import { CardTransactionDetail } from "../cards/orders/cardTransactionDetail";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import toast from "react-hot-toast";


export const CancelledOrder = () => {
  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailTransaction, setDetailTransaction] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  
  useEffect(() => {
    const getTransaction = async () => {
      const data = dataUser();
      setLoading(true);
      try {
        const response = await axios.get("/api/transaction", {
          params: { status1: "DIBATALKAN", idUser: data?.id},
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

    getTransaction();
  }, [updateTrigger]);

  const handleDelete = async (idTransaction) => {
    const toastLoading = toast.loading("Memproses...");
    try {
      const response = await axios.delete(`/api/transaction/${idTransaction}`);
      if (response.status === 200) {
        setUpdateTrigger((prev) => !prev);
        toast.dismiss(toastLoading);
        toast.success("Pesanan berhasil dihapus!");
      }
    } catch (error) {
      toast.dismiss(toastLoading);
      toast.error("Gagal menghapus pesanan!");
      console.log("ERROR DELETE TRANSACTION: ", error.message);
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
          Tidak ada transaksi dengan status "PESANAN DIBATALKAN"
        </p>
      )}
      {transaction.map((item) => (
        <div
          key={item.id}
          className="w-full mb-6 flex justify-between items-center rounded-xl bg-[#151515] border-[0.2px] border-main_bg shadow-xl shadow-black text-main_bg py-6 chrome-md:py-10 px-6 relative"
        >
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
          <div className="w-full grid grid-cols-5 gap-y-2 text-base text-center">
            {/* head */}
            <p className="font-bold">Produk</p>
            <p className="font-bold">Metode Pembayaran</p>
            <p className="font-bold">Status</p>
            <p className="font-bold">Total Harga</p>
            <p className="font-bold">Keterangan</p>
            {/* body */}
            <p className=" font-normal capitalize">{item.product?.productName || 'Produk sudah tidak tersedia'}</p>
            <p className=" font-normal">{item.paymentMethod?.method || 'Metode Pembayaran sudah tidak tersedia'}</p>
            <div className="flex flex-col items-center text-secondary gap-2">
              <ArchiveX size={20}/>
              <p className="capitalize font-semibold">
                PESANAN DIBATALKAN
              </p>
            </div>
            <p className="text-sm font-normal">
              {Intl.NumberFormat("id", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(item.totalPrice)}
            </p>
            <p className="text-xs text-secondary text-start">{isAdmin() ? item.message.replaceAll("Anda", "USER") : item.message}</p>
          </div>
          <div className="flex gap-4">
            <Dropdown className="bg-transparent">
              <DropdownTrigger>
                <button className="hover:bg-primary/30 duration-200 p-1 rounded-xl">
                  <Ellipsis size={26} className="text-main_bg" />
                </button>
              </DropdownTrigger>
              <DropdownMenu className="bg-[#151515] border-[0.16px] border-main_bg rounded-xl">
                <DropdownItem className="hover:bg-black/80 duration-200 py-3" key={"detail"} onClick={() => setDetailTransaction(item)}>
                  <div className="flex gap-2 text-sm text-main_bg">
                    <ReceiptText size={20}/>
                    <p>Detail Pesanan</p>
                  </div>
                </DropdownItem>
                <DropdownItem className="py-3 hover:bg-black/80 duration-200" key={"delete"} onClick={() => handleDelete(item.id)}>
                  <div className="flex gap-2 text-sm text-secondary">
                    <Trash2 size={20}/>
                    <p>Hapus Pesanan</p>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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

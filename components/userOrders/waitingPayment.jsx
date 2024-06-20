import { formatDate } from "@/lib/formatDate/formatDate";
import { checkUserRole } from "@/lib/sessionManagement/sessionCheck";
import axios from "axios";
import { isAfter } from "date-fns";
import Image from "next/legacy/image";
import React, { useEffect, useState } from "react";
import { PaymentConfirm } from "../cards/orders/paymentConfirm";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";
import toast from "react-hot-toast";

export const WaitingPayment = () => {
  const [role, setRole] = useState({});
  const [transaction, setTransaction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState();
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const now = new Date();

  useEffect(() => {
    const getTransaction = async () => {
      const roleData = await checkUserRole();
      setRole(roleData);
      setLoading(true);
      try {
        const response = await axios.get("/api/transaction", {
          params: { status1: "MENUNGGU_PEMBAYARAN", idUser: roleData?.data?.id},
        });         
        if (response.status === 200) {
          const transactionSorted = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
          const cancelledTransactions = transactionSorted.find((item) => isAfter(now, item.deadlinePaymentDate));
          if (cancelledTransactions) {
            try {
              const values = {
                status: "DIBATALKAN",
                message: "Masa pembayaran telah habis!"
              }
              const response = await axios.patch(`/api/transaction`, values);
              if (response.status === 200) {
                console.log("Berhasil mengganti status");
                transactionSorted.filter((item) => !isAfter(now, item.deadlinePaymentDate));
              }
            } catch (error) {
              console.log("ERROR GANTI STATUS: ", error.message);
              return;
            }            
          }
          setTransaction(transactionSorted);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.log("ERROR TRANSACTION: ", error);
      }
    };

    getTransaction();
  }, [updateTrigger]);

  const handleClickPayment = (selectedTransaction) => {
    setIsPaying(true);
    setSelectedTransaction(selectedTransaction);
  }

  const handleCancelTransaction = async (selectedTransaction) => {
    const toastLoad = toast.loading("Memproses...")
    try {
      const response = await axios.patch(`/api/transaction/${selectedTransaction.id}`, { status: 'DIBATALKAN', message: role.isAdmin ? 'ADMIN telah membatalkan pesanan ini' : 'Anda telah membatalkan pesanan ini', transaction: selectedTransaction });
      if(response.status === 200) {
        toast.dismiss(toastLoad);
        toast.success('Berhasil membatalkan transaksi');
        setUpdateTrigger((prev) => !prev);
      }
    } catch (error) {
     toast.dismiss(toastLoad);
     toast.error('Gagal membatalkan transaksi'); 
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
          Tidak ada transaksi dengan status "Menunggu Pembayaran"
        </p>
      )}
      {transaction.map((item) => (
        <div key={item.id} className="w-full mb-6 flex justify-between items-center rounded-xl bg-[#151515] border-[0.2px] border-main_bg shadow-xl shadow-black text-main_bg py-6 chrome-md:py-10 px-6 relative">    
          <p className="absolute top-3 right-3 text-main_bg text-[0.76rem]">{formatDate(item.orderDate)}</p>      
          <div className="w-12 h-12 absolute left-1 top-1">
            <Image 
              src="/images/main-logo.png"
              objectFit="cover"
              layout="fill"
            />
          </div>
          <div className="w-[80%] grid grid-cols-5 gap-y-2 text-base text-center">
            {/* head */}
            <p className="font-bold">Produk</p>
            <p className="font-bold">Metode Pembayaran</p>
            <p className="font-bold">Status</p>
            <p className="font-bold">Batas Pembayaran</p>           
            <p className="font-bold">Total Harga</p>           
            {/* body */}
            <p className="text-sm font-normal capitalize">{item.product?.productName || 'Produk sudah tidak tersedia'}</p>
            <p className="text-sm font-normal">{item.paymentMethod?.method || 'Metode Pembayaran sudah tidak tersedia'}</p>
            <p className="text-sm capitalize font-semibold text-orange-500">MENUNGGU PEMBAYARAN</p>
            <p className="text-sm font-normal ">{formatDate(item.deadlinePaymentDate)}</p>
            <p className="text-sm font-normal">{Intl.NumberFormat("id", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(item.totalPrice)}
            </p>
          </div>          
          <div className="flex gap-2">
            {role.isUser && (
              <button onClick={() => handleClickPayment(item)} className="bg-green-600 active:scale-[0.98] text-main_bg font-bold rounded-xl w-1/2 py-2 shadow-md shadow-black/40 text-[0.82rem] hover:bg-opacity-60 duration-200">Konfirmasi Pembayaran</button>            
            )}
            <Dropdown className="outline-none focus:outline-none bg-transparent">
              <DropdownTrigger className="focus:outline-none focus:ring-0 ring-0 outline-none">
                <button className={`bg-primary active:scale-[0.98] text-main_bg font-bold rounded-xl ${role.isUser ? 'w-1/2' : 'w-full'} px-2 py-2 shadow-md shadow-black/40 text-sm hover:bg-dark_primary duration-200`}>Batalkan Pesanan</button>
              </DropdownTrigger>
              <DropdownMenu className="bg-[#151515] border-[0.16px] border-main_bg/40 rounded-xl outline-none ring-0 w-full p-4">
                <DropdownItem className="hover:bg-[#151515] border-none ring-0 outline-none w-full">
                  <div className="flex flex-col items-center gap-2 w-full">
                    <p className="text-main_bg">Anda yakin ingin membatalkan pesanan ini?</p>
                    <div className="flex gap-2 justify-center w-3/4 mt-2">
                      <button onClick={() => handleCancelTransaction(item)} className="bg-secondary rounded-xl px-2 text-main_bg py-2 w-full text-xs hover:bg-opacity-60 duration-200 active:scale-[0.98]">Batalkan pesanan</button>
                      <button className="bg-main_bg rounded-xl text-[#151515] py-2 w-full text-xs hover:bg-opacity-60 duration-200 active:scale-[0.98]">Kembali</button>
                    </div>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      ))}
      {isPaying && (
        <PaymentConfirm 
          updateTrigger={() => setUpdateTrigger(!updateTrigger)} 
          closeModal={() => setIsPaying(false)} 
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};

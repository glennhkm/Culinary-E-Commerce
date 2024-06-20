"use client";

import axios from "axios";
import {
  BadgeDollarSign,
  CircleX,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/legacy/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';

export const ManagePaymentMethod = ({ closeModal }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [editingData, setEditingData] = useState({ method: "", noRekening: "" });
  const [idMethodEditing, setIdMethodEditing] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const getPaymentMethods = async () => {
      setisLoading(true);
      try {
        const response = await axios.get("/api/paymentMethod");
        if (response.status === 200) {
          setPaymentMethods(response.data);
        }
      } catch (error) {
        console.log("ERROR GET PAYMENT METHODS: ", error.message);
      } finally {
        setisLoading(false);
      }
    };

    getPaymentMethods();
  }, []);

  const handleEditing = (id) => {
    setIdMethodEditing(id);
    setEditingData(paymentMethods.find((item) => item.id === id));
  }

  const handleSaveMethod = async (id) => {
    if (editingData.method === "" ) {
        toast.error("Metode dan no rekening tidak boleh kosong!");
        return;
    }
    const toastLoading = toast.loading("Memproses...");
    try {
        if (isAdding) {
            const response = await axios.post("/api/paymentMethod", editingData);
            if (response.status === 201 || response.status === 200) {
                setPaymentMethods(paymentMethods.map((item) => item.id === idMethodEditing ? editingData : item));
                setIsAdding(false);
                setIdMethodEditing(null);
                toast.dismiss(toastLoading);
                toast.success("Metode pembayaran berhasil ditambahkan!");
            }                     
        }
        else {
            const response = await axios.patch(`/api/paymentMethod/${id}`, editingData);
            if (response.status === 200) {
                setPaymentMethods(paymentMethods.map((item) => item.id === id ? editingData : item));
                setIdMethodEditing(null);
                toast.dismiss(toastLoading);
                toast.success("Metode pembayaran berhasil diperbarui!");
            }
        }
    } catch (error) {
        toast.dismiss(toastLoading);
        toast.error("Gagal memproses metode pembayaran!");
        console.log("ERROR UPDATE PAYMENT METHOD: ", error.message);
    }    
  }

  const handleDelete = async (id) => {
    const toastLoading = toast.loading("Memproses...");
    try {
        const response = await axios.delete(`/api/paymentMethod/${id}`);
        if (response.status === 200) {
            setPaymentMethods(paymentMethods.filter((item) => item.id !== id));
            toast.dismiss(toastLoading);
            toast.success("Metode pembayaran berhasil dihapus!");
        }
    } catch (error) {
        toast.dismiss(toastLoading);
        toast.error("Gagal menghapus metode pembayaran!");
        console.log("ERROR DELETE PAYMENT METHOD: ", error.message);
    }
  }

  const handleClickAddButton = () => {
    const id = uuidv4();
    setIsAdding(true);
    setPaymentMethods([...paymentMethods, { id, method: "", noRekening: "" }]);
    setEditingData({ id, method: "", noRekening: "" });
    setIdMethodEditing(id);
  }

  const handleCancel = () => {
    if (isAdding){
        setIsAdding(false);
        setPaymentMethods(paymentMethods.filter((item) => item.id !== idMethodEditing));
        setEditingData({ method: "", noRekening: "" });
    }
    setIdMethodEditing(null);
  }

  return (
    <div className="w-screen h-screen bg-black/40 fixed top-0 left-0 flex flex-col justify-center items-center z-[1000]">
      <div className="w-1/2 flex justify-end -mb-4 -mr-5 relative z-[1001]">
        <button className="duration-100 hover:scale-110" onClick={closeModal}>
          <CircleX size={30} fill="#7D0A0A" className="text-[#151515]" />
        </button>
      </div>
      <div className="bg-[#151515] h-auto max-h-[76vh] overflow-x-hidden z-[1] scrollbar-thumb-rounded-full scrollbar-thin scrollbar-track-rounded-full scrollbar-thumb-main_bg/40 scrollbar-track-main_bg/5 w-1/2 rounded-xl shadow-xl shadow-black flex flex-col items-center py-12 px-8 gap-6 border-[0.1px] border-main_bg/30 relative">
        <div className="flex w-full justify-between items-center h-16">
          <div className="w-24 h-24 relative -ml-3">
            <Image
              src={"/images/main-logo.png"}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex gap-3 ">
            <BadgeDollarSign size={32} className="text-main_bg" />
            <h2 className="font-bold text-3xl text-main_bg">
              KELOLA METODE PEMBAYARAN
            </h2>
          </div>
        </div>
        <div className="w-full flex flex-col gap-4">
          <button onClick={handleClickAddButton} className="bg-primary hover:bg-dark_primary duration-200 rounded-xl text-main_bg flex gap-2 ml-auto py-3 px-4 shadow-black/80 shadow-lg font-semibold text-sm">
            <Plus size={20} />
            <p>Tambah Metode Pembayaran</p>
          </button>
          <table className="w-5/6 mx-auto ">
            <thead className="border-b-1 border-b-main_bg px-4">
              <tr className="font-bold">
                <th className="py-4 text-start pr-2">Metode</th>
                <th className="text-start">No Rekening</th>
              </tr>
            </thead>
            <tbody className="w-full">
              {isLoading && (
                <p className="text-main_bg font-semibold animate-blink py-4 text-center w-full">
                  Memuat Metode Pembayaran...
                </p>
              )}
              {paymentMethods.length < 1 && !isLoading && (
                <p className="text-main_bg font-semibold py-4 text-center">
                  Tidak ada metode pembayaran yang tersedia
                </p>
              )}
              {paymentMethods.map((item) => (
                <tr className="w-full font-normal pt-4">
                  <td className="py-3 text-main_bg ">
                    <input
                      type="text"
                      required
                      placeholder="Metode Pembayaran"
                      disabled={!(item.id === idMethodEditing)}
                      value={ idMethodEditing === item.id ? editingData.method : item.method}
                      onChange={(e) => setEditingData({ ...editingData, method: e.target.value })}
                      className="py-2 px-3 text-sm placeholder:text-[0.7rem] focus:outline-none rounded-xl disabled:bg-white/30 bg-transparent border-[0.16px] border-main_bg/40 disabled:border-none"
                    />
                  </td>
                  <td className="flex gap-4 items-center py-3 w-full justify-center">
                    <input
                      type="text"
                      required
                      placeholder="Kosongkan jika tidak ada"
                      disabled={!(item.id === idMethodEditing)}
                      value={ idMethodEditing === item.id ? editingData.noRekening : item.noRekening}
                      onChange={(e) => setEditingData({ ...editingData, noRekening: e.target.value })}
                      className="py-2 placeholder:text-[0.7rem] px-3 text-sm focus:outline-none rounded-xl disabled:bg-white/30 bg-transparent border-[0.16px] border-main_bg/40 disabled:border-none"
                    />
                    <div className="flex gap-2 items-center ml-auto">
                      {idMethodEditing === item.id ? (
                        <div className="flex gap-2">                            
                            <button
                              className="bg-green-600 border-[0.16px] border-main_bg/40 text-xs w-[4.6rem] hover:bg-opacity-60 p-2 duration-100 rounded-xl"
                              onClick={() => handleSaveMethod(item.id)}
                            >
                              Simpan
                            </button>
                            <button
                              className="bg-[#151515] border-[0.16px] border-main_bg/40 text-xs w-[4.6rem] hover:bg-black/20 p-2 duration-100 rounded-xl"
                              onClick={() => handleCancel()}
                            >
                              Batal
                            </button>
                        </div>
                      ) : (
                        <button
                          className="hover:bg-main_bg/30 p-2 duration-100 rounded-xl"
                          onClick={() => handleEditing(item.id)}
                        >
                          <Pencil size={20} className="text-main_bg" />
                        </button>
                      )}
                      {idMethodEditing !== item.id && (
                        <button onClick={() => handleDelete(item.id)} className="hover:bg-main_bg/30 p-2 duration-100 rounded-xl">
                            <Trash2 size={20} className="text-secondary" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

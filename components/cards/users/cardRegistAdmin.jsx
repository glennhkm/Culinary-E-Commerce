import toast from "react-hot-toast";
import Image from "next/legacy/image";
import React, { useState } from "react";
import { UserPlus, Plus, CircleX } from "lucide-react";
import axios from "axios";

export const CardRegistAdmin = ({ closeModal }) => {
  const [userData, SetUserData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/user", userData);
      if (response.status === 200) {
        toast.success("Pengguna berhasil ditambahkan!");
        closeModal();
      }
    } catch (error) {
      if (error.response.status === 409) {
        toast.error("Email telah terdaftar sebelumnya!");
        return;
      }
      toast.error("Gagal menambahkan pengguna!");
      console.log("ERROR: ", error);
    }
  };

  return (
    <div className="bg-black/80 fixed top-0 left-0 h-screen w-screen flex flex-col justify-center items-center z-50">
      <div className="w-1/2 flex justify-end -mb-4 -mr-5 relative z-[1001]">
        <button className="duration-100 hover:scale-110" onClick={closeModal}>
          <CircleX size={30} fill="#7D0A0A" className="text-[#151515]" />
        </button>
      </div>
      <div
        className="bg-[#151515] h-auto w-1/2 rounded-xl shadow-xl shadow-black flex flex-col items-center py-12 px-8 gap-6 border-[0.1px] border-main_bg/30 relative"
      >
        <div className="flex w-full justify-between items-center h-16">
          <div className="w-24 h-24 relative -ml-3">
            <Image
              src={"/images/main-logo.png"}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex gap-3 pr-2">
            <UserPlus size={32} className="text-main_bg" />
            <h2 className="font-bold text-3xl text-main_bg">TAMBAHKAN PENGGUNA BARU</h2>
          </div>
        </div>
        <form
          action=""
          className=" h-full w-full grid grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={userData.fullName}
            required
            placeholder="Nama Lengkap"
            onChange={(e) =>
              SetUserData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent"
          />
          <input
            type="text"
            value={userData.email}
            required
            placeholder="Email"
            onChange={(e) =>
              SetUserData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent"
          />
          <input
            type="text"
            value={userData.phoneNumber}
            required
            placeholder="Nomor Telepon"
            onChange={(e) =>
              SetUserData((prev) => ({ ...prev, phoneNumber: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent"
          />
          <input
            type="password"
            value={userData.password}
            required
            placeholder="Password"
            onChange={(e) =>
              SetUserData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent"
          />
          <textarea
            type="text"
            value={userData.address}
            required
            placeholder="Alamat Detail..."
            onChange={(e) =>
              SetUserData((prev) => ({ ...prev, address: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent col-span-2"
          />
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

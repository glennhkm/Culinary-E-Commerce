import Image from "next/legacy/image";
import React, { useEffect, useRef, useState } from "react";
import { Trash2, UserCog, SquarePen, X, Save, CircleX } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { isAdmin } from "@/lib/sessionManagement/sessionCheck";

export const CardDetailUser = ({ closeModal, userId }) => {
  const [isEditing, SetIsEditing] = useState(false);
  const modalRef = useRef(null);
  const [lastUserData, SetLastUserData] = useState({});
  const [userData, SetUserData] = useState({});
  const [isAdminRole, setIsAdminRole] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    const getUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        if (response.status === 200) {
          SetLastUserData(response.data);
          SetUserData(response.data);
        }
      } catch (error) {
        console.log("ERROR: ", error);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    setIsAdminRole(isAdmin());
    getUserData();
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isNewPassword = userData.password !== lastUserData.password;
      const data = {
        ...userData,
        isNewPassword
      }
      const response = await axios.put(`/api/user/${userId}`, data);
      if (response.status === 200) {
        SetIsEditing(false);
        SetLastUserData(userData);
        toast.success("Pengguna berhasil diperbarui");
      }
    } catch (error) {
      toast.error("Gagal memperbarui pengguna");
      console.log("ERROR: ", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`/api/user/${userId}`);
      if (response.status === 200) {
        toast.success("Pengguna berhasil dihapus");
        closeModal();
      }
    } catch (error) {
      toast.error("Gagal menghapus pengguna");
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
        ref={modalRef}
        className={`bg-[#151515] 'h-auto' scrollbar-thumb-rounded-full scrollbar-thin scrollbar-track-rounded-full scrollbar-thumb-main_bg/40 scrollbar-track-main_bg/5 overflow-y-scroll w-1/2 rounded-xl shadow-xl shadow-black flex flex-col items-center py-12 px-8 gap-6 border-[0.1px] border-main_bg/30 relative`}
      >
        <div className="flex w-full justify-between items-center h-16">
          <div className="w-24 h-24 relative -ml-3">
            <Image
              src={"/images/main-logo.png"}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex gap-3">
            <UserCog size={32} className="text-main_bg" />
            <h2 className="font-bold text-3xl text-main_bg">DETAIL PENGGUNA</h2>
          </div>
        </div>
        <div className="w-full flex justify-between text-sm">          
          <div className="flex gap-3">            
            <button
              onClick={() => {
                SetIsEditing(!isEditing);
                SetUserData(lastUserData);
              }}
              className={`hover:bg-opacity-60 duration-200 flex gap-2 font-semibold items-center shadow-xl shadow-black rounded-xl w-32 justify-center py-2.5 ${
                isEditing
                  ? "bg-primary text-main_bg"
                  : "bg-main_bg text-[#151515]"
              }`}
            >
              {isEditing ? (
                <>
                  <X size={20} />
                  <p>Batal</p>
                </>
              ) : (
                <>
                  <SquarePen size={20} />
                  <p>Edit</p>
                </>
              )}
            </button>
            {isEditing && (
              <button
                onClick={handleSubmit}
                className="hover:bg-opacity-60 duration-200 flex gap-2 text-[#151515] font-semibold items-center shadow-xl shadow-black rounded-xl w-32 justify-center py-2.5 bg-main_bg"
              >
                <Save size={20} />
                <p>Simpan</p>
              </button>
            )}
          </div>
          {isAdminRole && (          
            <Dropdown className="bg-opacity shadow-none">
              <DropdownTrigger>
                <button className="hover:bg-opacity-60 duration-200 flex gap-2 text-main_bg font-semibold tracking-wide items-center shadow-lg shadow-black rounded-xl w-32 justify-center py-2.5 bg-secondary">
                  <Trash2 size={20} />
                  <p>Hapus</p>
                </button>
              </DropdownTrigger>
              <DropdownMenu className="bg-[#151515] hover:bg-[#151515] hover:text-main_bg rounded-xl p-3 border-[0.3px] border-main_bg/20 shadow-lg shadow-black/60">
                <DropdownItem
                  className={`flex flex-col font-poppins hover:bg-[#151515] hover:text-main_bg text-main_bg`}
                >
                  <p>Anda yakin ingin menghapus?</p>
                  <div className="flex gap-2 justify-center mt-3">
                    <button
                      type="submit"
                      className="relative z-50 rounded-lg px-3 py-1 bg-secondary hover:bg-opacity-60 duration-150 text-main_bg"
                      onClick={handleDelete}
                    >
                      <p>Hapus</p>
                    </button>
                    <button className="relative z-50 rounded-lg px-3 py-1 bg-main_bg text-secondary hover:bg-opacity-60 duration-150">
                      <p>Batal</p>
                    </button>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
        <form
          action=""
          className="w-full grid grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <input
            disabled={!isEditing}
            type="text"
            value={userData.fullName}
            required
            placeholder="Full Name"
            onChange={(e) =>
              SetUserData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            className={`${
              !isEditing && "text-white/50 border-white/50"
            } w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent`}
          />
          <input
            disabled={!isEditing}
            type="text"
            value={userData.email}
            required
            placeholder="Email"
            onChange={(e) =>
              SetUserData((prev) => ({ ...prev, email: e.target.value }))
            }
            className={`${
              !isEditing && "text-white/50 border-white/50"
            } w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent`}
          />
          <input
            disabled={!isEditing}
            type="text"
            value={userData.phoneNumber}
            required
            placeholder="Phone Number"
            onChange={(e) =>
              SetUserData((prev) => ({ ...prev, phoneNumber: e.target.value }))
            }
            className={`${
              !isEditing && "text-white/50 border-white/50"
            } w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent`}
          />
          <input
            disabled={!isEditing}
            type="password"
            value={userData.password}
            required
            placeholder="Password"
            onChange={(e) =>
              SetUserData((prev) => ({ ...prev, password: e.target.value }))
            }
            className={`${
              !isEditing && "text-white/50 border-white/50"
            } w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent`}
          />
          <textarea
            disabled={!isEditing}
            type="text"
            value={userData.address}
            required
            placeholder="Address Detail ..."
            onChange={(e) =>
              SetUserData((prev) => ({ ...prev, address: e.target.value }))
            }
            className={`${
              !isEditing && "text-white/50 border-white/50"
            } w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-main_bg focus:border-transparent col-span-2`}
          />
        </form>
      </div>
    </div>
  );
};

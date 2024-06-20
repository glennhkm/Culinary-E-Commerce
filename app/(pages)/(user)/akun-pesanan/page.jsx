"use client";

import CardChangePassword from "@/components/cards/users/cardChangePassword";
import { CancelledOrder } from "@/components/userOrders/cancelledOrder";
import { OnProcess } from "@/components/userOrders/onProcess";
import { OrderDone } from "@/components/userOrders/orderDone";
import { WaitingPayment } from "@/components/userOrders/waitingPayment";
import { checkUserRole, dataUser } from "@/lib/sessionManagement/sessionCheck";
import axios from "axios";
import { Save, SquarePen, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const AkunPesanan = () => {
  const [userData, setUserData] = useState(() => {});
  const [lastUserData, setLastUserData] = useState({ ...userData });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [onShow, setOnShow] = useState(1);
  const menuRef = useRef();
  const [componentOnShow, setComponentOnShow] = useState(<WaitingPayment/>);
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const konfirmasi = searchParams.get('konfirmasi'); 
  const fullName = session?.user.fullName; 

  const informationMenu = [
    {
      id: 1,
      name: "Menunggu Pembayaran",   
      component: <WaitingPayment/>  
    },
    {
      id: 2,
      name: "Diproses",
      component: <OnProcess/>
    },
    {
      id: 3,
      name: "Pesanan Selesai",
      component: <OrderDone/>    
    },
    {
      id: 4,
      name: "Pesanan Dibatalkan",
      component: <CancelledOrder/>      
    },
  ]

  useEffect(() => {
    const scrollToMenuOrder = () => {      
      if (!konfirmasi) return;
      menuRef.current.scrollIntoView({ behavior: "smooth" })        
      if (konfirmasi === 'proses') {
        setOnShow(2);
        setComponentOnShow(<OnProcess/>);
      }
    }

    const setDataUser = async () => {
      const session = await checkUserRole();
      const { id, fullName, address, email, phoneNumber } = session?.data;
      setUserData({ id, fullName, address, email, phoneNumber });
    }

    setDataUser();
    scrollToMenuOrder();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastLoad = toast.loading("Memperbarui data...");
    try {
      const response = await axios.patch(`/api/user/${userData?.id}`, userData);
      if (response.status === 200) {
        setIsEditing(false);
        setLastUserData(userData);
        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...userData,
          },
        };
        await update(newSession);
        localStorage.setItem("user", JSON.stringify(newSession.user));
        toast.dismiss(toastLoad);
        toast.success("Data berhasil diperbarui!");
      }
    } catch (error) {
      toast.dismiss(toastLoad);
      toast.error("Gagal memperbarui data");
      console.log("ERROR: ", error);
    }
  };

  const handleClickInformationMenu = (informationObject) => {
    setOnShow(informationObject.id);
    setComponentOnShow(informationObject.component);
  }

  return (
    <>
      <div className="text-main_bg flex flex-col gap-4">
        <div className="rounded-xl bg-[#151515] w-full shadow-lg flex flex-col gap-6 shadow-black mt-4 p-12">
          <div className="flex w-full justify-between items-center">
            <h2 className="text-6xl font-bold">INFORMASI AKUN</h2>
            <div className="flex gap-4 items-center">
              <p className="text-3xl font-semibold">Hello, {fullName}</p>
              <div className="flex gap-3">
                {isEditing && (
                  <button
                    onClick={handleSubmit}
                    className="hover:bg-opacity-60 duration-200 flex gap-2 text-[#151515] font-semibold items-center shadow-xl shadow-black rounded-xl w-32 justify-center py-2.5 bg-main_bg"
                  >
                    <Save size={20} />
                    <p>Save</p>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setUserData(lastUserData);
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
                      <p>Cancel</p>
                    </>
                  ) : (
                    <>
                      <SquarePen size={20} />
                      <p>Edit</p>
                    </>
                  )}
                </button>                
              </div>
            </div>
          </div>
          <form action="" className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-main_bg font-bold">
                Nama Lengkap
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={userData?.fullName}
                required
                name="fullName"
                placeholder="Nama Lengkap"
                onChange={(e) => handleChange(e)}
                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none disabled:text-white/40 focus:ring-2 focus:ring-main_bg focus:border-transparent"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-main_bg font-bold">
                Email
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={userData?.email}
                required
                name="email"
                placeholder="Email"
                onChange={(e) => handleChange(e)}
                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none disabled:text-white/40 focus:ring-2 focus:ring-main_bg focus:border-transparent"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="phoneNumber" className="text-main_bg font-bold">
                Nomor Telepon
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={userData?.phoneNumber}
                required
                name="phoneNumber"
                placeholder="Nomor Telepon"
                onChange={(e) => handleChange(e)}
                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none disabled:text-white/40 focus:ring-2 focus:ring-main_bg focus:border-transparent"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="changePassword"
                className="text-main_bg font-bold"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsChangingPassword(true)}
                name="changePassword"
                className="w-full active:scale-[0.98] bg-main_bg text-[#151515] rounded-xl p-3 font-medium hover:bg-opacity-80 duration-200"
              >
                Perbarui Password
              </button>
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <label htmlFor="address" className="text-main_bg font-bold">
                Alamat Detail
              </label>
              <textarea
                type="text"
                disabled={!isEditing}
                value={userData?.address}
                required
                name="address"
                placeholder="Alamat Detail"
                onChange={(e) => handleChange(e)}
                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none disabled:text-white/40 focus:ring-2 focus:ring-main_bg focus:border-transparent"
              />
            </div>
          </form>
        </div>
      </div>
      <div className="rounded-xl bg-[#151515] w-full shadow-lg flex flex-col gap-8 shadow-black mt-4 p-12 text-main_bg h-auto" ref={menuRef}>
          <h2 className="text-6xl font-bold">INFORMASI PESANAN</h2>
          <div className="grid grid-cols-4">
            {informationMenu.map((item) => (
              <button key={item.id} onClick={() => handleClickInformationMenu(item)} className="hover:scale-105 active:scale-100 duration-200">
                <h3 key={item.id} onClick={() => setOnShow(item.id)} className={`duration-200 py-4 font-semibold rounded-t-xl ${item.id === onShow && 'text-center bg-main_bg/40'}`}>{item.name}</h3>
              </button>
            ))}            
            <div className="col-span-4 border-b-2 border-b-main_bg"></div>
          </div>
          <div>
            {componentOnShow}
          </div>
      </div>
      {isChangingPassword && (
        <CardChangePassword closeModal={() => setIsChangingPassword(false)} userId={userData?.id}/>
      )}
    </>
  );
};

export default AkunPesanan;

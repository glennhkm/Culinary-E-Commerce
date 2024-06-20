import axios from "axios";
import { CircleX, UserCog } from "lucide-react";
import Image from "next/legacy/image";
import { useState } from "react";
import toast from "react-hot-toast";

const CardChangePassword = ({closeModal, userId}) => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const [currentPassError, setCurrentPassError] = useState(false);
  const [confirmPassError, setConfirmPassError] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "newPasswordConfirm") {
      const confirmPassword = e.target.value;
      if (passwords.newPassword !== confirmPassword) {
        setConfirmPassError(true);
      } else {
        setConfirmPassError(false);
      }
    }
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  }


  const handleSavePassword = async (e) => {
    e.preventDefault();
    if(passwords.newPassword !== passwords.newPasswordConfirm){
      toast.error("Password baru dan konfirmasi password baru tidak sesuai");
      setConfirmPassError(true);
      return;
    }
    try {
        setConfirmPassError(false);
        const response = await axios.patch(`/api/user/changePassword/${userId}`, passwords);
        if(response.status === 200){
            toast.success("Password berhasil diubah");
            closeModal();
        }
    } catch (error) {
        if (error.response.status === 400) {
            toast.error(error.response.data.message);
            setCurrentPassError(true);            
            return;
        }
        toast.error("Gagal mengubah password");
        console.log("ERROR UBAH PASSWORD: ", error);
    }
  }

  return (
    <div className="fixed h-screen w-screen top-0 left-0 bg-black/60 flex flex-col justify-center items-center z-[1000]">
      <div className="w-1/3 flex justify-end -mb-4 -mr-5 relative z-[1001]">
        <button className="duration-100 hover:scale-110" onClick={closeModal}>
          <CircleX size={30} fill="#7D0A0A" className="text-[#151515]" />
        </button>
      </div>
      <div className="bg-[#151515] h-auto w-1/3 overflow-x-hidden z-[1] scrollbar-thumb-rounded-full scrollbar-thin scrollbar-track-rounded-full scrollbar-thumb-main_bg/40 scrollbar-track-main_bg/5 rounded-xl shadow-xl shadow-black/80 flex flex-col items-center pt-12 pb-7 px-8 gap-6 border-[0.1px] border-main_bg/30 relative">
        <div className="flex w-full justify-between items-center h-16">
          <div className="w-24 h-24 relative -ml-3">
            <Image
              src={"/images/main-logo.png"}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex gap-3 pr-2">
            <UserCog size={32} className="text-main_bg" />
            <h2 className="font-bold text-2xl text-main_bg">
              PERBARUI PASSWORD
            </h2>
          </div>
        </div>
        <form className="flex flex-col gap-6 w-full" onSubmit={handleSavePassword}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="currentPassword"
              className="font-bold text-lg text-main_bg"
            >
              Password Saat Ini
            </label>
            <input
              name="currentPassword"
              type="password"
              required
              onChange={(e) => handleChange(e)}
              className={`py-4 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary px-3 ${currentPassError && 'ring-2 ring-secondary'}`}
              placeholder="Masukkan password saat ini"
            />
            {currentPassError && <p className="text-xs text-secondary px-2">Password tidak sesuai</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="newPassword"
              className="font-bold text-lg text-main_bg"
            >
              Password Baru
            </label>
            <input
              name="newPassword"
              type="password"
              required
              onChange={(e) => handleChange(e)}
              className="py-4 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary px-3"
              placeholder="Masukkan password baru"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="newPasswordConfirm"
              className="font-bold text-lg text-main_bg"
            >
              Konfirmasi Ulang Password Baru
            </label>
            <input
              name="newPasswordConfirm"
              type="password"
              required
              onChange={(e) => handleChange(e)}
              className={`py-4 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary px-3 ${confirmPassError && 'ring-2 ring-secondary'}`}
              placeholder="Konfirmasi password baru"
            />
            {confirmPassError && <p className="text-xs text-secondary px-2">Password tidak sesuai</p>}
          </div>
          <button type="submit" className="bg-primary hover:bg-dark_primary rounded-xl text-xl text-main_bg py-4 font-bold duration-200 mt-2">
            Simpan
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardChangePassword;

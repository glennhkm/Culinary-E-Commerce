"use client";

import Image from "next/legacy/image";
import React, { useState } from "react";
import { CornerUpLeft } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SignUp = () => {  
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    setUserData((prev) => ({...prev, [e.target.name]: e.target.value}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/user', userData);
      if(response.status === 201 || response.status === 200){
        toast.success('Pendaftaran berhasil!');
      }
      router.replace('/auth/sign-in');
    } catch (error) {
      if(error.response.status === 409){
        toast.error(error.response.data.message);
        return;
      }
      toast.error('Failed to Register');
      console.log("ERROR: ", error);
    }
  }

  return (
    <div className="bg-main_bg/70 rounded-xl w-full flex flex-col gap-6 items-center pb-12 pt-11 text-primary shadow-xl drop-shadow-xl shadow-black px-10 relative">
      <Link href="/">
        <div className="absolute top-5 left-4 flex gap-1 items-center text-secondary hover:text-primary">
          <CornerUpLeft className="w-5" />
          <p className="font-semibold text-sm">Beranda</p>
        </div>
      </Link>
      <h1 className="text-3xl chrome-md:text-4xl font-semibold">Daftar</h1>
      <div className="relative w-20 h-20 chrome-md:w-32 chrome-md:h-32 -mt-3 -mb-1">
        <Image
          src="/images/main-logo.png"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <form action="" className="grid grid-cols-2 gap-4 w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          required
          onChange={(e) => handleChange(e)}
          placeholder="Full Name"
          name="fullName"
          className="w-full p-3 chrome-md:text-base text-sm border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <input
          type="text"
          required
          onChange={(e) => handleChange(e)}
          placeholder="Email"
          name="email"
          className="w-full p-3 chrome-md:text-base text-sm border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <input
          type="text"
          required
          onChange={(e) => handleChange(e)}
          placeholder="Phone Number"
          name="phoneNumber"
          className="w-full p-3 chrome-md:text-base text-sm border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <input
          type="password"
          required
          onChange={(e) => handleChange(e)}
          placeholder="Password"
          name="password"
          className="w-full p-3 chrome-md:text-base text-sm border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <textarea
          type="text"
          required
          onChange={(e) => handleChange(e)}
          placeholder="Address Detail ..."
          name="address"
          className="w-full p-3 chrome-md:text-base text-sm border col-span-2 border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button className="w-full bg-primary chrome-md:text-base text-sm col-span-2 hover:bg-main_bg shadow-md shadow-black/50 hover:text-secondary duration-200 font-semibold tracking-wide text-main_bg rounded-lg p-3 mt-3">
          Daftar
        </button>
      </form>
      <div className="flex text-xs chrome-md:text-sm gap-1 mt-6 text-secondary">
        <p className="font-normal">Sudah punya akun?</p>
        <Link href={"/auth/sign-in"}>
          <button className="font-semibold hover:text-primary">Masuk</button>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;

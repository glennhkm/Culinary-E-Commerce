"use client";

import Image from "next/legacy/image";
import React, { useEffect, useState } from "react";
import { CircleAlert, CornerUpLeft, Loader } from "lucide-react";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { isGuest } from "@/lib/sessionManagement/sessionCheck";

const SignIn = () => {
  const [userData, SetUserData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [redirecting, setRedirecting] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  useEffect(() => {
    if (!isGuest()) {
      router.push("/");
    };
  }, []);

  const handleChange = (e) => {
    SetUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setRedirecting("Mengecek...")
      const response = await signIn("credentials", {
        email: userData.email,
        password: userData.password,
        redirect: false,
      });
      if (response.ok) {
        setError(null);
        const session = await getSession();        
        localStorage.setItem("user", JSON.stringify(session.user));
        toast.success("Login berhasil, mengalihkan...");
        setRedirecting(null);
        if (session) {          
          router.push(callbackUrl || (session.user.role === 'ADMIN' ? "/admin" : '/'));
        }
      } else {
        setRedirecting(null); 
        setError(response.error);
      }
    } catch (error) {
      setRedirecting(null);
      console.log("ERROR: ", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="bg-main_bg/70 rounded-xl w-3/4 flex flex-col gap-6 items-center pb-12 pt-11 text-primary shadow-xl drop-shadow-xl shadow-black px-10 relative">
      <Link href="/">
        <div className="absolute top-5 left-4 flex gap-1 items-center text-secondary hover:text-primary">
          <CornerUpLeft className="w-5" />
          <p className="font-semibold text-sm">Beranda</p>
        </div>
      </Link>
      <h1 className="text-3xl chrome-md:text-4xl font-semibold">Masuk</h1>
      <div className="relative w-20 h-20 chrome-md:w-32 chrome-md:h-32 -mt-3 -mb-1">
        <Image src="/images/main-logo.png" layout="fill" objectFit="cover" />
      </div>
      <form
        action=""
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          required
          onChange={(e) => handleChange(e)}
          placeholder="Email"
          name="email"
          className="w-full p-3 border chrome-md:text-base text-sm border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <input
          type="password"
          required
          onChange={(e) => handleChange(e)}
          placeholder="Password"
          name="password"
          className="w-full p-3 border chrome-md:text-base text-sm border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {redirecting && (
          <div className="flex gap-2 text-blue-700 items-center px-1">
            <Loader size={20} className="animate-spin"/>
            <p className="text-xs animate-blink">{redirecting}</p>
          </div>
        )}
        {error && (
          <div className="flex gap-2 text-secondary items-center px-1">
            <CircleAlert size={20}/>
            <p className="text-xs">{error}</p>
          </div>
        )}        
        <button className="w-full chrome-md:text-base text-sm bg-primary shadow-md shadow-black/50 hover:bg-main_bg hover:text-secondary duration-200 font-semibold tracking-wide text-main_bg rounded-lg p-3 mt-3">
          Masuk
        </button>
      </form>
      <div className="flex text-xs chrome-md:text-sm gap-1 mt-6 text-secondary">
        <p className="font-normal">Belum punya akun?</p>
        <Link href={"/auth/sign-up"}>
          <button className="font-semibold hover:text-primary">Daftar</button>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;

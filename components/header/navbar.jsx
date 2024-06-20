"use client";

import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useState, useEffect } from "react";
import { isAdmin, isGuest, isUser } from "@/lib/sessionManagement/sessionCheck";
import { getSession, signOut } from "next-auth/react";
import { CardDetailUser } from "../cards/users/cardDetailUser";
import { BookUser, Home, LogOut, Soup,  } from "lucide-react";

export const Navbar = ({ className }) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userData, setUserData] = useState(null);
  const [profileModal, setProfileModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navbar = [
    {
      title: "Beranda",
      url: "/",
      icon: (<Home size={20} className="text-main_bg" />),
    },
    {
      title: "Menu",
      url: "/menu",
      icon: (<Soup size={20} className="text-main_bg" />),
    },
  ];
  
  const userDropdown = [
    {
      name: "Informasi Akun dan Pesanan",
      url: "/akun-pesanan",
      icon: (<BookUser size={20} className="text-main_bg" />),
      routeFunc: () => router.push("/akun-pesanan"),
    },
    {
      name: "Keluar",
      icon: (<LogOut size={20} className="text-main_bg" />),
      routeFunc: async () => {
        await signOut({
          callbackUrl: '/'
        })
        localStorage.removeItem("user");
      },
    },
  ];

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    const getSessionData = async () => {
      const session = await getSession();
      setUserData(session?.user);
    }
    getSessionData();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      {pathname.includes("/auth") || pathname.includes("/admin") ? null : (
        <div
          className={`font-poppins w-[92.6vw] h-auto fixed top-8 left-1/2 -translate-x-1/2 rounded-[4rem] bg-primary flex px-6 justify-between items-center shadow-lg shadow-black/60 drop-shadow-xl z-50 transition-transform duration-[300ms] ${
            showNavbar ? "translate-y-0" : "-translate-y-36"
          } ${className}`}
        >
          <Image priority src="/images/main-logo.png" width={86} height={86} alt="logo-navbar"/>
          <ul className="flex list-none gap-9">
            {navbar.map((item) => (
              <Link key={item.title} href={item.url} className={`flex gap-2 group items-center hover:scale-105 active:scale-100 duration-200 ${pathname === item.url && 'bg-main_bg/40 px-6 rounded-3xl'}`}>
                {item.icon}
                <li className={`hover:text-shadow-xl duration-200 shadow-red-500 text-main_bg py-3 `}>
                  {item.title}
                </li>
              </Link>
            ))}
            {isUser() && (
              <>
                {userDropdown.map((item) => (
                  <button key={item.name} onClick={item.routeFunc} className={`flex gap-2 group items-center hover:scale-[1.02] active:scale-100 duration-200 ${pathname === item.url && 'bg-main_bg/40 px-6 rounded-3xl'}`}>
                    {item.icon}
                    <li className={`hover:text-shadow-xl shadow-red-500 text-main_bg py-3`}>
                      {item.name}
                    </li>
                  </button>
                ))}
              </>
            )}
          </ul>
          {(isGuest() || isAdmin()) && (
            <Link href={isAdmin() ? `/admin` : '/auth/sign-in'}>
              <button className=" bg-secondary tracking-wide text-main_bg py-[0.6rem] px-7 rounded-3xl shadow-lg drop-shadow-lg text-sm duration-200 hover:bg-third hover:text-primary shadow-black/40">
                {isAdmin() ? `Admin` : 'Masuk'}
              </button>
            </Link>
          )}
          {profileModal && (
            <div className="h-screen w-screen top-0 left-0 fixed z-[1000] overflow-hidden">
              <CardDetailUser closeModal={() => setProfileModal(false)} userId={userData.id}/>
            </div>    
          )}
        </div>
      )}
    </>
  );
};

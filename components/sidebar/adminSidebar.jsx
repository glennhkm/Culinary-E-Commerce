"use client";

import Image from "next/legacy/image";
import { LayoutDashboard, Users, Soup, HandCoins, Menu, LogOut } from "lucide-react";
import { croissant_one } from "@/lib/fonts/font";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAdminSidebarContext } from "@/context/adminSidebarContext";
import { signOut } from "next-auth/react";

export const AdminSidebar = () => {
  const { isShowSidebar, SetIsShowSidebar } = useAdminSidebarContext();
  const pathname = usePathname();
  const sidebarItems = [
    {
      name: "Dashboard",
      icon: (
        <LayoutDashboard
          size={20}
          className=" group-hover:scale-110 group-active:scale-100 duration-200"
        />
      ),
      href: "/admin",
    },
    {
      name: "Pengguna",
      icon: (
        <Users
          size={20}
          className=" group-hover:scale-110 group-active:scale-100 duration-200"
        />
      ),
      href: "/admin/users",
    },
    {
      name: "Produk",
      icon: (
        <Soup
          size={20}
          className=" group-hover:scale-110 group-active:scale-100 duration-200"
        />
      ),
      href: "/admin/products",
    },
    {
      name: "Pesanan",
      icon: (
        <HandCoins
          size={20}
          className=" group-hover:scale-110 group-active:scale-100 duration-200"
        />
      ),
      href: "/admin/orders",
    },
  ];

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/'
    })
    localStorage.removeItem("user");
  }

  return (
    <div
      className={`relative ${isShowSidebar ? "w-[24vw]" : "w-[6vw]"} bg-black/70 h-screen text-main_bg/95 transition-all border-r-[3px] border-[#151515] shadow-right`}
    >
      <div className="absolute top-0 left-0 h-full w-full -z-[1]">
        <Image
          src={"/images/blurredbanner.webp"}
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      <div className={`h-[5.6rem] flex gap-3 w-full ${isShowSidebar ? 'justify-between pl-6 pr-10' : 'justify-center'} items-center bg-primary shadow-xl shadow-black rounded-b-3xl`}>
        <button
          className="hover:scale-110 duration-200 slide-in active:scale-100"
          onClick={() => SetIsShowSidebar(!isShowSidebar)}
        >
          <Menu size={30} className="text-main_bg" />
        </button>
        {isShowSidebar && (
          <div className="flex gap-2 items-center slide-in">
            <Link href={"/"}>
              <Image
                src={"/images/logo-kuliner-typo.png"}
                width={80}
                height={80}
              />
            </Link>
            <h2
              className={`font-bold text-main_bg text-3xl ${croissant_one.className}`}
            >
              Admin
            </h2>
          </div>
        )}
      </div>
      <div className="py-10 text-main_bg flex flex-col h-[94%] justify-between">
        <div className="px-2">
          {sidebarItems.map((item) => (
            <Link href={item.href} key={item.name}>
              <div className={`${!isShowSidebar && 'justify-center'} slide-in flex gap-3 hover:gap-4 items-center ${pathname === item.href && "bg-primary"} py-4 px-5 group duration-200  rounded-full`}>
                {item.icon}
                {isShowSidebar && (
                  <p className="font-semibold slide-in group-hover:scale-110 group-active:scale-100 duration-200">
                    {item.name}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className={`${!isShowSidebar && 'justify-center'} bg-primary w-auto slide-in flex gap-3 hover:gap-4 items-center py-4 px-5 group duration-200 cursor-pointer`} onClick={handleSignOut}>
          <LogOut
            size={20}
            className=" group-hover:scale-110 group-active:scale-100 duration-200 rotate-180"
          />
          {isShowSidebar && (
            <p className="font-semibold slide-in group-hover:scale-110 group-active:scale-100 duration-200">
              Sign Out
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

"use client";

import Image from "next/image";
import React from "react";
import { Instagram, Mail, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const pathname = usePathname();
  return (
    <>
      {pathname.includes("/auth") || pathname.includes("/admin") ? null : (
        <div
          className={`font-poppins w-screen bg-gradient-to-b from-main_bg/60 to-transparent via-main_bg/60 shadow-t`}
        >
          <div className="w-full grid grid-cols-2 gap-x-60 px-12 pt-12 pb-4 text-primary">
            <Image
              src={"/images/main-logo.png"}
              width={100}
              height={100}
              className="-mt-5"
              alt="logo-footer"
            />
            <div className="flex flex-col gap-2">
              <p className="font-bold text-xl mb-2">Kontak</p>
              <div className="flex gap-3 ">
                <Phone size={24} />
                <p>081234567890</p>
              </div>
              <div className="flex gap-3 ">
                <Mail size={24} />
                <p>fashakuliner@gmail.com</p>
              </div>
              <div className="flex gap-3 ">
                <Instagram size={24} />
                <p>fashakuliner</p>
              </div>
            </div>
            <p className="-mt-10 pl-3">
              Selamat datang di Fasha Kuliner, destinasi utama untuk
              menikmati makanan dan minuman tradisional khas Aceh. Berdiri sejak
              tahun 2024, kami berkomitmen untuk menghadirkan cita rasa autentik
              Aceh ke meja Anda. Terima kasih telah memilih kami untuk memenuhi
              kebutuhan kuliner Anda
            </p>
            <div className="pt-8 flex flex-col gap-2">
              <p className="font-bold text-xl mb-1">Alamat</p>
              <p className="">
                Jalan Kopelma No. 20, 23123, Aceh Besar, Aceh, Indonesia
              </p>
            </div>
          </div>
          <p className="text-center font-light text-sm tracking-wide pt-4 pb-3 text-primary">
            Hak Cipta © 2024 | Fasha Kuliner
          </p>
        </div>
      )}
    </>
  );
};

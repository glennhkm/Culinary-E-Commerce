import Image from "next/legacy/image";
import Link from "next/link";
import React from "react";

export const CardDashboard = ({ data }) => {
  return (
    <>
      {data.map((item) => (
        <Link key={item.title} href={item.href && item.href}>
          <div className="group cursor-pointer h-[35vh] chrome-md:h-[36vh] w-full relative rounded-xl shadow-xl bg-[#151515] shadow-black/50">
              <div className="flex flex-col gap-4 text-main_bg h-full justify-center items-center w-full">
                  {item.icon}
                  <h3 className="font-bold text-3xl group-hover:text-[2.16rem] duration-200">{item.title}</h3>
                  <p className="w-2/3 text-center">
                    {item.title === 'Jumlah Pendapatan' ? Intl.NumberFormat("id", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(item.value) + ' Jumlah Pendapatan' : item.value + ' ' + item.title}
                  </p>
              </div>
          </div>
        </Link>
      ))}
    </>
  );
};

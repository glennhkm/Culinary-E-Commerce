import Image from "next/legacy/image";
import React from "react";

export const CardCategory = ({ data }) => {
  return (
    <>
      {data.map((item) => (
        <div key={item.namaKategori} className="group h-[40vh] w-full relative rounded-xl shadow-xl bg-gradient-to-t from-primary/20 to-black/50 duration-200 hover:bg-black/40 via-black/50 shadow-black/50">
            <div className="h-full w-full absolute -z-10 rounded-xl ">
                <Image
                    src={item.image}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                    loading="lazy"
                />
            </div>
            <div className="flex flex-col gap-4 text-main_bg h-full justify-center items-center w-full">
                <h3 className="font-bold text-3xl group-hover:text-4xl duration-200">{item.namaKategori}</h3>
                <p className="w-2/3 text-center">{item.description}</p>
            </div>
        </div>
      ))}
    </>
  );
};

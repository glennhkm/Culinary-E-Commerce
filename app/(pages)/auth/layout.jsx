import Image from "next/legacy/image";
import React, { Suspense } from "react";

const AuthLayout = ({ children }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className={`font-poppins flex gap-10 px-12 relative w-screen h-screen justify-center items-center overflow-hidden`}
      >
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[url('/images/blurredbanner.webp')] bg-cover"></div>
        <div className="w-1/2 h-1/2 relative">
          <Image
            src={"/images/logo-kuliner-typo.png"}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="w-1/2 flex justify-center py-10">{children}</div>
      </div>
    </Suspense>
  );
};

export default AuthLayout;

"use client";

import Image from "next/legacy/image";
import { usePathname } from "next/navigation";

const MenuLayout = ({ children }) => {
const pathname = usePathname();
const lastPathname = pathname.split('/').pop();

return (
    <div className={`w-screen relative h-full px-20 bg-gradient-to-b from-[#151515] to-main_bg/60 via-main_bg/60 ${lastPathname === 'menu' ? 'via-90% to-10% py-40' : 'via-30% to-70% py-[9.6rem]'}`}>
        <div className="absolute top-0 left-0 -z-[1] w-screen h-full overflow-hidden bg-[url('/images/pattern.jpg')] bg-cover opacity-10"></div>
        {children}
    </div>
);
};

export default MenuLayout;

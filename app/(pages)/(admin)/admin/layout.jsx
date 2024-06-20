"use client";

import { AdminSidebar } from "@/components/sidebar/adminSidebar";
import { useAdminSidebarContext } from "@/context/adminSidebarContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { getSession } from "next-auth/react";

const AdminLayout = ({ children }) => {
  useEffect(() => {
    const gateaway = async () => {
      const session = await getSession();
      if (!session?.user?.role === "ADMIN") return redirect("/menu");
    };

    gateaway();
  }, []);

  const { isShowSidebar } = useAdminSidebarContext();

  return (
    <div className={`font-poppins flex w-screen h-screen`}>
      <div className="fixed top-0 left-0 z-10">
        <AdminSidebar />
      </div>
      <div
        className={`relative w-full h-full ${
          isShowSidebar ? "pl-[24.2vw]" : "pl-[6.2vw]"
        } transition-all overflow-y-auto scrollbar bg-[url('/images/pattern.jpg')] bg-cover scrollbar-w-[0.6rem] scrollbar-thumb-black/40 scrollbar-track-[#151515]/75 scrollbar-thumb-rounded-full scrollbar-track-rounded-full`}
      >
        <div className="fixed w-screen h-screen left-0 top-0 z-0 bg-[#151515]/95"></div>
        <div className="p-12 relative z-10">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;

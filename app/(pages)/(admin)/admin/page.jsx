"use client";

import { CardDashboard } from "@/components/cards/dashboard/cardDashboard";
import axios from "axios";
import { HandCoins, Handshake, Soup, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [dataDashboard, setDataDashboard] = useState([
    {
      title: "Pengguna",
      value: 0,
      icon: <Users size={40} />,
      href: "/admin/users",
    },
    {
      title: "Produk",
      value: 0,
      icon: <Soup size={40} />,
      href: "/admin/products",
    },
    {
      title: "Produk Terjual",
      value: 0,
      icon: <Handshake size={40} />,
      href: "/admin/orders",
    },
    { 
      title: "Jumlah Pendapatan",
      value: 0,
      icon: <HandCoins size={40} />,
      href: '/admin/orders',
    },
  ]);

  useEffect(() => {
    const getAllData = async () => {
      try {
        const response = await axios.get("/api/dashboard");
        if (response.status === 200) {
          const updatedData = dataDashboard.map((item) => {
            const newData = response.data.find(data => data.title === item.title);
            return newData ? { ...item, value: newData.value } : item;
          });
          const sortData = updatedData.sort((a, b) => parseInt(a.id) - parseInt(b.id));
          setDataDashboard(sortData);
        }
      } catch (error) {
        
      }
    }

    getAllData();
  }, []);


  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-5xl chrome-md:text-7xl tracking-wide font-extrabold text-main_bg -mt-3">
        DASHBOARD
      </h1>
      <div className="grid grid-cols-2 gap-7 z-[1]">
        <CardDashboard data={dataDashboard} />
      </div>
    </div>
  );
};

export default AdminDashboard;

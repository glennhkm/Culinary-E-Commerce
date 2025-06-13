"use client";

import { CardCatalog } from "@/components/cards/products/cardCatalog";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import {
  Filter,
  ChevronDown,
  ArrowUpDown,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
  ArrowDown10,
  ArrowUp10,
  Search,
  TicketPercent,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const Menu = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-6 chrome-md:gap-8 w-full">
      <h1 className="text-5xl chrome-md:text-7xl tracking-wide font-extrabold text-main_bg opacity-100 -mt-3">
        MENU
      </h1>      
      <div
        className={`grid grid-cols-4 transition-all gap-6 ${
          loading && "h-screen"
        }`}
      >
        {loading && (
          <p className="animate-blink col-span-4 w-full text-xl text-center text-primary font-semibold pt-32">
            Memuat Produk...
          </p>
        )}
        {!loading && (
          <CardCatalog/>
        )}
      </div>
    </div>
  );
};

export default Menu;

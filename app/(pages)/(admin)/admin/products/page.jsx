"use client";

import { CardAddProduct } from "@/components/cards/products/cardAddProduct";
import { CardCatalog } from "@/components/cards/products/cardCatalog";
import { useAdminSidebarContext } from "@/context/adminSidebarContext";
import { Button } from "@nextui-org/react";
import { Plus } from "lucide-react";
import React, { useState } from "react";

const AdminProduct = () => {
  const { isShowSidebar } = useAdminSidebarContext();
  const [isAdding, setIsAdding] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(false);

  return (
    <div className="flex flex-col gap-6 chrome-md:gap-8 w-full">
      <h1 className="text-5xl chrome-md:text-7xl tracking-wide font-extrabold text-main_bg -mt-3">
        PRODUK
      </h1>
      <div className="flex w-full justify-end items-center text-main_bg">
        <div>
          <Button
            color="primary"
            className="rounded-xl shadow-lg shadow-black/60"
            endContent={<Plus />}
            onClick={() => setIsAdding(!isAdding)}
          >
            Tambah Baru
          </Button>
        </div>
      </div>
      <div className={`grid ${isShowSidebar ? 'grid-cols-3' : 'grid-cols-4'} transition-all gap-6`}>
        <CardCatalog
          updateTrigger={updateTrigger}
          isShowSidebar={isShowSidebar}
        />
      </div>
      {isAdding && (
        <CardAddProduct
          closeModal={() => setIsAdding(false)}
          updateTrigger={() => setUpdateTrigger((prev) => !prev)}
        />
      )}
    </div>
  );
};

export default AdminProduct;
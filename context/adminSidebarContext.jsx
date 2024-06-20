'use client';

import { createContext, useContext, useState } from "react";

const AdminSidebarContext = createContext();

export const AdminSidebarProvider = ({ children }) => {
  const [isShowSidebar, SetIsShowSidebar] = useState(true);
  const value = { isShowSidebar, SetIsShowSidebar };
  return (
    <AdminSidebarContext.Provider value={value}>
      {children}
    </AdminSidebarContext.Provider>
  );
};

export const useAdminSidebarContext = () => {
  return useContext(AdminSidebarContext);
};

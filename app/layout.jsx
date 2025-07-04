import "./globals.css";
import { Navbar } from "@/components/header/navbar";
import { Footer } from "@/components/footer/footer";
import { Toaster } from "react-hot-toast";
import { NextUIProvider } from "@nextui-org/react";
import { AdminSidebarProvider } from "@/context/adminSidebarContext";
import { ClientSessionProvider } from "@/components/session/sessionProvider";

export const metadata = {
  title: "Fasha Kuliner",
  description: "Fasha Kuliner adalah tempat jualan makanan khas aceh",
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['apple-touch-icon.png']
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="font-poppins">
      <body className="overflow-x-hidden scrollbar-thin scrollbar-thumb-main_bg/90 scrollbar-track-[#151515] scrollbar-thumb-rounded-xl">
        <ClientSessionProvider>
          <AdminSidebarProvider>
            <Navbar className={`font-bold`} />
            <NextUIProvider>{children}</NextUIProvider>
            <Footer />
            <Toaster
              toastOptions={{
                className: "font-poppins",
                position: "top-center",
                style: {
                  background: "#151515",
                  color: "#fff",
                },
              }}
            />
          </AdminSidebarProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat UNLP",
  description: "Creado con ❤️ por Nahuel Zubiarrain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-gradient-to-b from-gray-50 to-blue-200 text-black">
          <div className="h-12">
            <Navbar />
          </div>
          <div className="min-h-[calc(100vh-3rem)]">{children}</div>
        </div>
      </body>
    </html>
  );
}

"use client"
import { ChatProvider } from "@/context/ChatContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ChatProvider>
      {children}
    </ChatProvider>
  );
}

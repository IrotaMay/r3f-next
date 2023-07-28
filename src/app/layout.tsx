import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SideBar from "@/components/feature/SideBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const pages = [
  { href: "/", name: "Home" },
  { href: "/cube", name: "Cube" },
  { href: "/bubble", name: "Bubble" },
  { href: "/magicbox", name: "MagicBox" },
  { href: "/ocean", name: "Ocean" },
  { href: "/godray", name: "Godray" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`flex min-h-screen ${inter.className}`}>
        <SideBar pages={pages} />
        {children}
      </body>
    </html>
  );
}

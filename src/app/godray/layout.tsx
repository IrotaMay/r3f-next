import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Godrays",
  description: "Postprocessing Godrays",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-screen h-screen m-0 p-0 overflow-hidden bg-sky-100 overscroll-y-none">
      {children}
    </main>
  );
}

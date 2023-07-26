"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

type Props = {
  href: string;
  name: string;
};

export default function NavigationItem({ href, name }: Props) {
  const router = usePathname();
  return (
    <Link
      href={href}
      className={`
        ${router === href ? "bg-sky-500 shadow-lg shadow-sky-500/50" : ""}
        w-full rounded-lg flex items-center p-3 text-white duration-200 hover:bg-sky-500 hover:shadow-lg hover:shadow-sky-500/50
      `}
    >
      <p className="ml-2.5">{name}</p>
    </Link>
  );
}

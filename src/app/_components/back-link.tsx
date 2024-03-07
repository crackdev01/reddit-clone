"use client";

import Link from "next/link";
import Image from "next/image";

import { BackSvg } from "@/app/_assets/svg";

export const BackLink = () => {
  return (
    <Link href="/" className="flex gap-4 text-sm font-medium">
      <Image src={BackSvg} alt="back" /> Back to posts
    </Link>
  );
};

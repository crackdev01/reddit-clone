"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { PATH } from "@/app/constants";

import {
  HomeSvg,
  HomeActiveSvg,
  PostActiveSvg,
  PostSvg,
  LoginActiveSvg,
  LoginSvg,
} from "@/app/_assets/svg";

export const LeftSidebar = () => {
  const pathname = usePathname();
  const [menuHover, setMenuHover] = useState("");

  return (
    <NavigationMenu className="border-r border-gray-200 px-4 pb-10 pt-10">
      <NavigationMenuList className="flex h-[calc(100vh-80px)] flex-col items-start justify-between">
        <div>
          <NavigationMenuItem className="w-[277px]">
            <Link href={PATH.HOME} legacyBehavior passHref>
              <NavigationMenuLink
                onMouseOver={() => setMenuHover(PATH.HOME)}
                onMouseLeave={() => setMenuHover("")}
                className={`inline-flex gap-x-4 bg-background px-4 py-2 text-base font-medium text-gray-700 hover:bg-accent hover:text-indigo-600 ${PATH.HOME === pathname && "text-indigo-600"}`}
              >
                <Image
                  src={
                    menuHover === PATH.HOME || pathname === PATH.HOME
                      ? HomeActiveSvg
                      : HomeSvg
                  }
                  alt="Home Menu"
                />
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <SignedIn>
              <Link href={PATH.MYPOST} legacyBehavior passHref>
                <NavigationMenuLink
                  onMouseOver={() => setMenuHover(PATH.MYPOST)}
                  onMouseLeave={() => setMenuHover("")}
                  className={`inline-flex  gap-x-4 bg-background px-4 py-2 text-base font-medium text-gray-700 hover:bg-accent hover:text-indigo-600 ${PATH.MYPOST === pathname && "text-indigo-600"}`}
                >
                  <Image
                    src={
                      menuHover === PATH.MYPOST || pathname === PATH.MYPOST
                        ? PostActiveSvg
                        : PostSvg
                    }
                    alt="Home Menu"
                  />
                  My posts
                </NavigationMenuLink>
              </Link>
            </SignedIn>
            <SignedOut>
              <NavigationMenuLink
                onMouseOver={() => setMenuHover(PATH.LOGIN)}
                onMouseLeave={() => setMenuHover("")}
                className={`inline-flex  gap-x-4 bg-background px-4 py-2 text-base font-medium text-gray-700 hover:bg-accent hover:text-indigo-600`}
              >
                <Image
                  src={
                    menuHover === PATH.MYPOST || pathname === PATH.MYPOST
                      ? LoginActiveSvg
                      : LoginSvg
                  }
                  alt="Home Menu"
                />
                <SignInButton>Login</SignInButton>
              </NavigationMenuLink>
            </SignedOut>
          </NavigationMenuItem>
        </div>
        <div style={{ direction: "rtl" }} className="pl-3">
          <SignedIn>
            <UserButton showName />
          </SignedIn>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

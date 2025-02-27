"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Button from "./Button";
import { MdClose, MdMenu } from "react-icons/md";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="w-screen shadow-md z-50 bg-white fixed top-0 left-0 right-0">
      <div className="mx-auto max-w-7xl px-6  lg:px-8 z-50">
        <div className=" relative flex h-20 items-center justify-between">
          <div className="flex flex-1  items-center justify-center md:items-stretch md:justify-start">
            {/* <!-- Logo --> */}
            <Link className="flex flex-shrink-0 items-center" href="/">
              <p className=" text-secondary text-2xl font-bold ml-2">
                Brand<span className="text-primary">Boost</span>
              </p>
            </Link>
            {/* <!-- Desktop Menu Hidden below md screens --> */}
            <div className="hidden md:ml-6 md:block">
              <div className="flex space-x-2">
                <Link
                  href="/"
                  className={`${
                    pathname === "/"
                      ? " font-extrabold text-secondary"
                      : "text-secondary/70"
                  }  hover:text-secondary rounded-md px-3 py-2`}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className={`${
                    pathname === "/about"
                      ? " font-extrabold text-secondary"
                      : "text-secondary/70"
                  }  hover:text-secondary rounded-md px-3 py-2`}
                >
                  About
                </Link>
                <Link
                  href="/find-influencer"
                  className={`${
                    pathname === "/find-influencer"
                      ? " font-extrabold text-secondary"
                      : "text-secondary/70"
                  }  hover:text-secondary rounded-md px-3 py-2`}
                >
                  Find Influencer
                </Link>
                <Link
                  href="/find-influencer"
                  className={`${
                    pathname === "/find-influencer"
                      ? " font-extrabold text-secondary"
                      : "text-secondary/70"
                  }  hover:text-secondary rounded-md px-3 py-2`}
                >
                  Why BrandBoost
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden md:block md:ml-6">
            <div className="flex items-center gap-4">
              <Button bgColor="bg-primary" textColor="text-white">
                Join As Brand
              </Button>
              <Button bgColor="bg-primary-light" textColor="text-primary">
                Join As Creator
              </Button>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center md:hidden">
            {/* <!-- Mobile menu button--> */}
            {!isMobileMenuOpen ? (
              <MdMenu
                size={24}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            ) : (
              <MdClose
                size={24}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            )}
          </div>
        </div>
      </div>
      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      {isMobileMenuOpen && (
        <div id="mobile-menu  ">
          <div className=" flex flex-col space-y-1 px-2 pb-3 pt-2">
            <Link
              href="/"
              className={`${
                pathname === "/" ? " font-extrabold" : ""
              } text-secondary hover:font-extrabold hover:text-secondary rounded-md px-3 py-2`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`${
                pathname === "/about" ? " font-extrabold" : ""
              } text-secondary hover:font-extrabold hover:text-secondary rounded-md px-3 py-2`}
            >
              About
            </Link>
            <Link
              href="/find-influencer"
              className={`${
                pathname === "/find-influencer" ? " font-extrabold" : ""
              } text-secondary hover:font-extrabold hover:text-secondary rounded-md px-3 py-2`}
            >
              Find Influencer
            </Link>
            <Link
              href="/about"
              className={`${
                pathname === "/about" ? " font-extrabold" : ""
              } text-secondary hover:font-extrabold hover:text-secondary rounded-md px-3 py-2`}
            >
              Why BrandBoost
            </Link>

            <div className="block md:ml-6">
              <div className="flex items-center justify-evenly">
                <Button bgColor="bg-primary" textColor="text-white">
                  Join As Brand
                </Button>
                <Button bgColor="bg-primary-light" textColor="text-primary">
                  Join As Creator
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

'use client'

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import SignInButton from "./SignInButton";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { SiGithub } from "react-icons/si";

const Navbar = () => {
  const { data: session, status } = useSession();
  return (
    <nav className="h-16 absolute top-0 px-8 w-full">
      <div className="text-sm sm:text-lg h-full max-w-4xl mx-auto w-full flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-4">
          <div className="font-bold text-base sm:text-2xl group relative">
            <div className="absolute left-0 right-0 bottom-1 sm:bottom-1.5 h-1">
              <div className="animated-underline duration-500 bg-primary-200" />
            </div>
            <Link href="/" className="relative">
                <span
                  className="select-none text-primary-300 absolute translate-x-0.5 sm:translate-x-[0.1875rem] -translate-y-0.5 sm:-translate-y-[0.1875rem] font-medium"
                  aria-hidden="true"
                >
                  g
                </span>
                <span className="relative">
                  <span className="font-medium text-primary-800">g</span>itlink
                </span>
            </Link>
          </div>
          <div>
            <a
              href="https://github.com/Rajat-5544/gitlink"
              target="_blank"
              rel="noreferrer"
              className="text-opacity-60 hover:text-opacity-100 text-gray-900"
            >
              <SiGithub className="w-4 sm:w-5 h-4 sm:h-5" />
            </a>  
          </div>  
        </div>
        <div className="flex items-center justify-end gap-6 sm:gap-10">
          {status === "loading" ? null : status === "authenticated" ? (
            <>
              <div className="group relative">
                <div className="absolute left-0 right-0 bottom-1 sm:bottom-1.5 h-1">
                  <div className="animated-underline duration-500 bg-primary-200" />
                </div>

                <Link href="/dashboard" className="relative">
                  Dashboard
                </Link>
              </div>
              <Menu as="div" className="relative w-10 h-10">
                <MenuButton className="flex items-center justify-center w-full h-full border-2 border-primary-400 rounded-full overflow-hidden">
                  <Image
                    width={36}
                    height={36}
                    src={`https://github.com/${
                      session?.user.githubUsername as string
                    }.png`}
                    alt=""
                  />
                </MenuButton>
                <Transition
                  as={Fragment}
                  enter="ease-out duration-100"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-75"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <MenuItems className="mt-2 text-base border border-gray-300 absolute right-0 w-max p-1 origin-top bg-white rounded-lg shadow-lg shadow-gray-100">
                    <MenuItem as="div" className="px-4 py-1.5" disabled>
                      {session?.user.githubUsername as string}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          className={`font-medium rounded-md px-4 py-1.5 text-left w-full ${
                            active ? "bg-gray-100" : ""
                          }`}
                          onClick={() => {
                            signOut({
                              callbackUrl: process.env.NEXT_PUBLIC_URL,
                            });
                          }}
                        >
                          Sign out
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
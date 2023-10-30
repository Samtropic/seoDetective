import React from "react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import LogoutLink from "@/components/LogoutLink";

const Header = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return (
    <>
      <header className="max-w-lg mx-auto my-4 flex items-center justify-between">
        <a
          href="/"
          className="text-3xl font-bold bg-gradient-to-r from-dark-orange to-medium-orange text-transparent bg-clip-text hover:animate-pulse"
        >
          SEODetective
        </a>
        <div className="flex items-center gap-2 bg-orange-100 p-2 rounded-full">
          <Image
            className="h-12 rounded-full bg-orange-400"
            src={user?.image as string | StaticImport}
            alt="Profile pic"
            width={48}
            height={48}
          />
          <div className="pr-4 leading-4">
            <h3 className="font-bold">{user?.name}</h3>
            <br />
            <LogoutLink />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

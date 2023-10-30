"use client";
import React from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import DoubleHeader from "@/components/DoubleHeader";

const LoginScreen = () => {
  return (
    <main className="mx-auto bg-white mt-8 max-w-md border-blue-100 border-b-4 rounded-xl p-4 py-6 text-center">
      <DoubleHeader
        preTitle="Welcome back !"
        mainTitle="Login to your account"
      />
      <button
        onClick={() => signIn("google")}
        className="inline-flex gap-2 items-center bg-red-400 my-6 text-white px-6 py-2 rounded-xl border border-red-600 border-b-4"
      >
        <Image
          className=""
          src="/assets/icons/google_24px.svg"
          width={24}
          height={24}
          alt="logo"
        ></Image>
        Log in with Google
      </button>
    </main>
  );
};

export default LoginScreen;

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import LoginScreen from "./LoginScreen";
import Header from "./Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={inter.className}>
        {!session && <LoginScreen />}
        {session && (
          <div className="max-w-lg mx-auto">
            <Header />
            {children}
          </div>
        )}
      </body>
    </html>
  );
}

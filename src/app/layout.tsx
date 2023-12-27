import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CTF 2024",
  description: "New year CTF event by Cyandev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center gap-12 p-24">
          <div className="flex max-w-3xl w-full items-baseline justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">🏳️ CTF 2024</h1>
              <p className="text-sm text-zinc-600">Presented by Cyandev</p>
            </div>
            <div className="flex gap-4">
              <Link className="text-blue-500 hover:underline" href="/">
                Home
              </Link>
              <Link className="text-blue-500 hover:underline" href="/ranking">
                Ranking
              </Link>
            </div>
          </div>
          {children}
        </main>
      </body>
    </html>
  );
}

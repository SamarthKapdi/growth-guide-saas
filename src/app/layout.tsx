import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Cheerio Growth Guide — Your Next Best Growth Move",
  description: "Discover and activate the right Cheerio features to grow your business. A product prototype for the Cheerio AI Product Intern assignment.",
};

import { AppProvider } from "@/lib/store";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${inter.className} bg-[#FAFBFC] text-gray-900`}>
        <AppProvider>
          {children}
          <Toaster position="top-right" />
        </AppProvider>
      </body>
    </html>
  );
}

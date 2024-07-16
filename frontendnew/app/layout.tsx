import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "./globals.css";
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from "@/providers/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "Eternal Storage",
  description:
    "A file storage system which supports unlmited upload and download with high speed servers. Easily share files with friends.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    url: "/",
    title: "Eternal Storage",
    description:
      "A file storage system which supports unlmited upload and download with high speed servers. Easily share files with friends.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Eternal Storage",
    description:
      "A file storage system which supports unlmited upload and download with high speed servers. Easily share files with friends."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

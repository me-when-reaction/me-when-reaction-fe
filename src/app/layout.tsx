import React from 'react';
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import classNames from 'classnames';

const font = Open_Sans({
  subsets: ["latin"],
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={classNames(font.className, 'box-border')}>{children}</body>
    </html>
  );
}

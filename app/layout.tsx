import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bharat Export Atlas — India's Export Economy, Mapped",
  description:
    "An interactive supply–demand intelligence model of India's export economy and a data-grounded white-space entry thesis. Built on 2,000 real companies (BS1000) and official trade data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

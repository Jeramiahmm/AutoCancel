import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoCancel",
  description: "Never forget to cancel a free trial again.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-[family-name:var(--font-sans)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

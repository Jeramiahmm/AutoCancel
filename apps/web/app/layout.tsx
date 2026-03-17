import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AutoCancel",
    template: "%s · AutoCancel",
  },
  description:
    "AutoCancel detects free trials and subscriptions from your inbox, then reminds you before you get charged.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#030303] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

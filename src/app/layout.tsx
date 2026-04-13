import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "CSRP Report Assistant",
  description: "Generate Company-Specific Risk Premium report sections for valuation reports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Babson Job Portal",
  description: "Exclusive job search platform for Babson College students and alumni.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          id="keak-script"
          src="https://zzontar2hsjaawcn.public.blob.vercel-storage.com/scripts/domain-575-httpsbabson-job-portal-v2.vercel.app.js"
          type="text/javascript"
          data-domain="575"
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1 relative z-10">
            {children}
          </main>
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}

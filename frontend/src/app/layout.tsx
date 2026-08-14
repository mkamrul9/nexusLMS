import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NexusLMS — Modern Learning Management System",
  description: "A premium role-based learning management platform for students, teachers, and administrators.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: { iconTheme: { primary: '#0d9488', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Navbar />
        <main className="flex-1 flex flex-col relative w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

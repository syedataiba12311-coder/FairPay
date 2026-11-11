import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FairPay AI — Freelancer Platform',
  description: 'Find projects, manage contracts, track payments and build your freelance career with AI-powered tools.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-[#f5f6fa] text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}

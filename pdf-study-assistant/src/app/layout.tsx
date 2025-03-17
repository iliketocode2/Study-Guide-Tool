import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PDF Study Assistant',
  description: 'Generate AI study materials from your PDF documents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        {children}
  );
}
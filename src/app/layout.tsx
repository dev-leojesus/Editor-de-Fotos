import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ImageFX Studio',
  description: 'AI-Powered Photo Editor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Script src="https://unpkg.com/@imgly/background-removal@1.4.1/dist/imglyRemoveBackground.umd.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}

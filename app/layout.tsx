import type React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lumina App',
  description: 'Lumina loyalty program app',
  generator: 'v0.app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className="font-sans antialiased bg-background">
        <div className="min-h-screen">
          <div className="site-container">{children}</div>
        </div>
      </body>
    </html>
  );
}

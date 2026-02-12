import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Movie Explorer',
  description: 'Search, explore, and save your favorite movies',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arc Stablecoin AI Dashboard',
  description: 'Modern AI dashboard for stablecoin analytics and payment simulation.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}

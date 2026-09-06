import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MobileBottomNavigation from '../components/layout/MobileBottomNavigation';

export const metadata: Metadata = {
  title: 'GoShashi — Your Personal Home Care Supercharged',
  description:
    'Book verified professionals for home cleaning, appliance repair, plumbing, electrical, carpentry, and more in Gurugram.',
  keywords: [
    'home services',
    'Gurugram home cleaning',
    'AC repair',
    'electrician',
    'plumber',
    'GoShashi',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomNavigation />
      </body>
    </html>
  );
}

import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SilkBackground from '@/components/SilkBackground';

export const metadata = {
  title: 'GlowSpot Hyderabad — AI-Powered Beauty Salon Marketplace',
  description: 'Describe your look, preview it on your face, and book the perfect Hyderabad salon. AI-powered style advisor, face preview, wedding planner, and conversational booking.',
  keywords: 'beauty salon, Hyderabad, AI, bridal makeup, hair styling, wedding planner, salon booking, face preview',
  openGraph: {
    title: 'GlowSpot Hyderabad — AI-Powered Beauty Salon Marketplace',
    description: 'Describe your look, preview it on your face, and book the perfect Hyderabad salon.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#080608]">
        <SilkBackground />
        <Navbar />
        <main className="flex-1 relative z-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-cream">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

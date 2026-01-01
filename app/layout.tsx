import type { Metadata, Viewport } from "next";
import { Josefin_Sans, Lato } from "next/font/google";
import HeaderContainer from "@/components/header/HeaderContainer";
import FooterContainer from "@/components/footer/FooterContainer";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const josefin = Josefin_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-josefin', 
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'], 
  display: 'swap',
  variable: '--font-lato', 
});


// 1. Separate Viewport (Recommended for Next.js 14+)
export const viewport: Viewport = {
  themeColor: "#7E33E0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// 2. Updated Metadata
export const metadata: Metadata = {
  // --- Basic Metadata ---
  title: {
    default: "Waterms - Modern Furniture Store",
    template: "%s | Waterms",
  },
  description: "Discover premium furniture and home decor at Hekto. Quality designs for every room.",
  keywords: ["Furniture", "Interior Design", "Modern Chairs", "Hekto Store"],
  authors: [{ name: "Water Medics Store" }],
  creator: "Axiom Team",
  
  // --- PWA Essentials ---
  manifest: "/manifest.json", // Link to your manifest file
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Waterms",
    // startupImage: "/startup.png", // Optional: Splash screen image
  },
  formatDetection: {
    telephone: false,
  },

  // --- OpenGraph (Facebook, WhatsApp, LinkedIn) ---
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    title: "Hekto - Modern Furniture Store",
    description: "Premium furniture and home decor for modern living.",
    siteName: "Hekto",
    images: [
      {
        url: "https://your-domain.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hekto Furniture Gallery",
      },
    ],
  },

  // --- Twitter Card ---
  twitter: {
    card: "summary_large_image",
    title: "Hekto Furniture Store",
    description: "Modern furniture for your dream home.",
    images: ["https://your-domain.com/twitter-image.jpg"],
    creator: "@your_twitter_handle",
  },

  // --- Icons & Favicons ---
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // --- Search Engine Robots ---
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en">
      <body
        className={`${josefin.variable} ${lato.variable} antialiased`}
      >
        <CartProvider>
        <HeaderContainer />
        {children}
        <FooterContainer />
        </CartProvider>
      </body>
    </html>
  );
}


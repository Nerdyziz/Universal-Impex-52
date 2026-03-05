
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

import PillNav from "@/components/PillNav";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "Universal Impex 52";
const SITE_DESCRIPTION =
  "Universal Impex 52 — Your trusted supplier, importer & exporter of premium automobile parts & industrial components. Browse top brands, request bulk quotes, and streamline your supply chain.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://universalimpex52.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Supplier, Importer & Exporter of Automobile Parts`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Universal Impex 52",
    "automobile parts",
    "B2B automotive",
    "industrial components",
    "bulk auto parts",
    "automotive supplier",
    "OEM parts",
    "spare parts wholesale",
    "automotive B2B marketplace",
    "Nagpur auto parts",
    "automobile importer exporter",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Supplier, Importer & Exporter of Automobile Parts`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Automobile Parts & Industrial Components`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Supplier, Importer & Exporter of Automobile Parts`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

// JSON-LD Organization structured data
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description: SITE_DESCRIPTION,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9869113692",
    contactType: "sales",
    email: "ui52jnpt@gmail.com",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "510, Loharpura, Behind Arya Samaj Bhavan, CA Road",
    addressLocality: "Nagpur",
    postalCode: "440018",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  sameAs: [],
};

// JSON-LD WebSite structured data for sitelinks search
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
     
        <CartProvider>
       <PillNav

  logoAlt="Company Logo"
  items={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Products', href: '/products' },
    { label: 'Brands', href: '/brands' },
    { label: 'Contact', href: '/contact' }
  ]}
  activeHref="/"
  className="custom-nav"
  ease="power2.easeOut"
  baseColor="#ffffff"
  pillColor="#ffffff"
  hoveredPillTextColor="#000000"
  pillTextColor="#000000"
  initialLoadAnimation={true}
  glassBase={true}        // ← enables glass on black backgrounds
/>
          <main>{children}</main>
          <Footer />
        </CartProvider>
    
      </body>
    </html>
  );
}

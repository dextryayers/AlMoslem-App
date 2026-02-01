import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import LoadingScreen from "./components/LoadingScreen";
import Footer from "./components/Footer";
import CookieConsentBanner from "./components/CookieConsentBanner";
import { fontVariables } from "./lib/fonts";

export const metadata: Metadata = {
  title: {
    default: "Al-Moslem - Al-Quran Digital & Asisten Islami Indonesia",
    template: "%s | Al-Moslem"
  },
  description: "Platform Al-Quran Digital terlengkap karya Hanif Abdurrohim. Dilengkapi terjemahan Kemenag, tafsir, audio murottal 30 Juz, hadits shahih, doa harian, dan Ustaz AI. Baca Quran online bebas iklan dengan mode gelap nyaman.",
  applicationName: "Al-Moslem",
  authors: [{ name: "Hanif Abdurrohim", url: "https://haniipp.space" }],
  keywords: [
    "Al-Quran Online", 
    "Al-Moslem",
    "Baca Quran Digital", 
    "Al-Quran Terjemahan Indonesia", 
    "Tafsir Quran Kemenag", 
    "Hadits Shahih", 
    "Kumpulan Doa Harian", 
    "Murottal MP3 30 Juz", 
    "Ustaz AI", 
    "Tanya Jawab Islam AI",
    "Jadwal Sholat",
    "Asmaul Husna",
    "Baca Yasin Online",
    "Ayat Kursi",
    "Hanif Abdurrohim"
  ],
  creator: "Hanif Abdurrohim",
  publisher: "Hanif Abdurrohim",
  metadataBase: new URL("https://almoslem.haniipp.space"),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "google-site-verification-code", // Ganti dengan kode verifikasi GSC Anda
  },
  openGraph: {
    title: "Al-Moslem - Al-Quran Digital & Asisten Islami Indonesia",
    description: "Baca Al-Quran online dengan terjemahan Bahasa Indonesia, tafsir, audio murottal, hadits, dan konsultasi syariah dengan Ustaz AI.",
    url: "https://almoslem.haniipp.space",
    siteName: "Al-Moslem",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-Moslem - Al-Quran Digital & Asisten Islami Indonesia",
    description: "Baca Al-Quran online dengan terjemahan Bahasa Indonesia, tafsir, audio murottal, hadits, dan konsultasi syariah dengan Ustaz AI.",
    creator: "@haniipp",
  },
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
  icons: {
    icon: '/image/favicon.ico',
    shortcut: '/image/favicon.ico',
    apple: '/image/logo.png', // Optional: Use logo.png for Apple touch icon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`antialiased bg-gray-50 dark:bg-transparent text-gray-900 dark:text-[#e7eaf6] font-sans ${fontVariables}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://almoslem.haniipp.space/#website",
                  "url": "https://almoslem.haniipp.space",
                  "name": "Al-Moslem",
                  "description": "Platform Al-Quran Digital terlengkap dengan Terjemahan, Tafsir, dan AI Assistant.",
                  "publisher": {
                    "@type": "Organization",
                    "name": "Hanif Abdurrohim",
                    "logo": {
                      "@type": "ImageObject",
                      "url": "https://almoslem.haniipp.space/image/logo.png"
                    }
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://almoslem.haniipp.space/?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://almoslem.haniipp.space/#organization",
                  "name": "Al-Moslem",
                  "url": "https://almoslem.haniipp.space",
                  "logo": "https://almoslem.haniipp.space/image/logo.png",
                  "sameAs": [
                    "https://github.com/haniipp",
                    "https://instagram.com/haniipp"
                  ]
                }
              ]
            })
          }}
        />
        <Providers>
          <LoadingScreen />
          <div className="fixed inset-0 pointer-events-none z-[-1] opacity-0 dark:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-[#222831]"></div>
            <div className="stars-sm absolute inset-0"></div>
            <div className="stars-md absolute inset-0"></div>
            <div className="stars-lg absolute inset-0"></div>
          </div>
          <div className="flex flex-col min-h-screen">
            {children}
            <Footer />
          </div>
          <CookieConsentBanner />
        </Providers>
      </body>
    </html>
  );
}

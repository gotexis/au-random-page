import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: {
    default: "RandomPage — Discover Books One Passage at a Time",
    template: "%s | RandomPage",
  },
  description:
    "Discover classic literature through random passages. Get a fresh excerpt from 40+ classic books every time you visit.",
  openGraph: {
    title: "RandomPage — Discover Books One Passage at a Time",
    description:
      "Discover classic literature through random passages from Project Gutenberg's public domain library.",
    url: "https://randompage.rollersoft.com.au",
    siteName: "RandomPage",
    locale: "en_AU",
    type: "website",
  },
  alternates: {
    canonical: "https://randompage.rollersoft.com.au",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: {
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="night">
      <body className="min-h-screen bg-base-100 flex flex-col">
        <header className="navbar bg-primary text-primary-content shadow-lg">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <a className="text-xl font-bold" href="/">
              📖 RandomPage
            </a>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex-1 pb-24">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}

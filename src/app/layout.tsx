import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@gokulsaraswat/ui/tokens.css";
import "@gokulsaraswat/ui/styles.css";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { ChatBotWrapper } from "@/components/site/chat-bot-wrapper";
import { MusicPlayer } from "@/components/site/music-player";
import { GlobalKeyboardShortcuts } from "@/components/global-keyboard-shortcuts";
import { SettingsAwareCursor } from "@/components/settings-aware-cursor"
import { GlobalLoader } from "@/components/site/global-loader";
import { BackToTop } from "@/components/site/back-to-top";
import { CookieConsent } from "@/components/site/cookie-consent";
import { SkipToContent } from "@/components/site/skip-to-content";
import { KeyboardShortcutsOverlay } from "@/components/site/keyboard-shortcuts-overlay";
import { JsonLd } from "@/components/site/jsonld";
import { getPersonJsonLd } from "@/lib/jsonld";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Gokul Saraswat | Backend Engineer",
    template: "%s | Gokul Saraswat",
  },
  description:
    "Backend Engineer with 3 years of experience architecting high-availability microservices for enterprise banking. Specializing in Java, Spring Boot, and distributed systems.",
  keywords: [
    "Gokul Saraswat",
    "Backend Engineer",
    "Java",
    "Spring Boot",
    "Microservices",
    "Oracle",
    "Software Engineer",
    "Portfolio",
    "Bangalore",
  ],
  authors: [{ name: "Gokul Saraswat" }],
  creator: "Gokul Saraswat",
  openGraph: {
    title: "Gokul Saraswat | Backend Engineer",
    description:
      "Backend Engineer architecting high-availability microservices for enterprise banking.",
    url: "https://gokulsaraswat.com",
    siteName: "Gokul Saraswat",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gokul Saraswat | Backend Engineer",
    description:
      "Backend Engineer architecting high-availability microservices for enterprise banking.",
    creator: "@gokulsaraswat",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = await getPersonJsonLd();
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <JsonLd data={personJsonLd} />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              <SkipToContent />
              {children}
              <GlobalLoader />
              <ChatBotWrapper />
              <Toaster />
              <KeyboardShortcutsOverlay />
              <MusicPlayer />
              <BackToTop />
              <CookieConsent />
        </ThemeProvider>
             <SettingsAwareCursor />
      </body>
    </html>
  );
}
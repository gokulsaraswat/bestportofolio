import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@wrksz/themes/next";
import { ChatBotWrapper } from "@/components/site/chat-bot-wrapper";
import { MusicPlayer } from "@/components/site/music-player";
import { GlobalKeyboardShortcuts } from "@/components/global-keyboard-shortcuts";
import { SettingsAwareCursor } from "@/components/settings-aware-cursor"

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              {children}
              <ChatBotWrapper />
              <Toaster />
              <MusicPlayer /> 
        </ThemeProvider>
             <SettingsAwareCursor />
      </body>
    </html>
  );
}
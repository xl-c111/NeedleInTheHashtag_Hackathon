import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/components/Auth";
import { siteConfig } from "@/config/site";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.description}`,
  description:
    "A safe space for young men to share, listen, and find their way forward. Connect with real people who understand.",
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  keywords: [
    "peer support",
    "mental health",
    "young men",
    "loneliness",
    "community",
    "anonymous support",
    "mens health",
  ],
  robots: "index, follow",
  authors: [{ name: "been there Team" }],
  creator: "been there",
  openGraph: {
    title: siteConfig.name,
    description:
      "A safe space for young men to share, listen, and find their way forward.",
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@beenthereapp",
    title: siteConfig.name,
    description:
      "A safe space for young men to share, listen, and find their way forward.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistSans.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <main className="relative min-h-screen w-full overflow-hidden scroll-smooth">
              {children}
            </main>
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

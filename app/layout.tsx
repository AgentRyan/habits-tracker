import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Habits",
  description: "Track your daily habits and build stronger weeks",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Habits",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f0f0f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

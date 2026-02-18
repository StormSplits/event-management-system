import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google"; // Using Inter and Sora as per design system
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "College Event Management System",
    template: "%s | College Event System",
  },
  description: "Seamlessly manage and attend campus events.",
  keywords: ["college", "events", "management", "students", "campus"],
  authors: [{ name: "Anish" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${sora.variable} antialiased bg-neutral-50 text-neutral-900`}
      >
        {children}
      </body>
    </html>
  );
}

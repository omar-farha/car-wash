import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مغسلة السيارات",
  description: "احجز موعدك لغسيل سيارتك أو دراجتك بسهولة وسرعة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-center"
          dir="rtl"
          richColors
          toastOptions={{ className: "font-sans" }}
        />
      </body>
    </html>
  );
}

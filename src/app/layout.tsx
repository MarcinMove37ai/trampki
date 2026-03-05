// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trampki na Giełdzie",
  description: "Aplikacja edukacji finansowej dla młodzieży",
  icons: {
    icon: "/wa.webp",
    apple: "/wa.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body style={{ margin: 0, padding: 0, background: "#F8FAFF" }}>
        {children}
      </body>
    </html>
  );
}
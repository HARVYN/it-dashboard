import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard IT - Gestión de Tecnología",
  description: "Dashboard profesional para gestión de IT con análisis mensual e histórico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

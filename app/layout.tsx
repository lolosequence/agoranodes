import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/4nk/auth-context";

export const metadata: Metadata = {
  title: "Agoranodes - Démocratie Directe Décentralisée",
  description: "Plateforme de gouvernance participative basée sur Bitcoin et le tirage au sort",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

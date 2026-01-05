import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vantage Specialty EHR",
  description: "High-fidelity Electronic Health Record platform for specialty medical practices. HIPAA-compliant clinical documentation, charting, and patient management.",
  keywords: ["EHR", "Electronic Health Record", "Medical", "Healthcare", "Clinical Notes", "SOAP", "Cardiology", "Pediatrics"],
  authors: [{ name: "Vantage Health Systems" }],
};

import { AuthProvider } from '@/components/auth-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
            <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
            >
            {children}
            </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

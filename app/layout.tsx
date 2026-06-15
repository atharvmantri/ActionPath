import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ActionPath — Crisis-to-Action Translator for ADHD Students",
  description:
    "Seven AI agents working together so one ADHD student never misses a deadline again. Paste a school email, get an actionable checklist in seconds.",
  keywords: ["ADHD", "executive function", "school email", "AI", "Gemini", "deadline tracker", "student tool"],
  authors: [{ name: "ActionPath Team" }],
  openGraph: {
    title: "ActionPath — Never Miss a Deadline Again",
    description: "AI-powered executive function tool for ADHD students",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ position: 'relative', zIndex: 1 }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

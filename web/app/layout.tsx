import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

// Import Material Icons in the head

export const metadata: Metadata = {
  title: 'WeddingOS - Dashboard',
  description: 'Seu casamento, sob controle.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${jakarta.variable} ${playfair.variable} font-sans bg-background text-text-primary antialiased`}>
        <main className="mx-auto max-w-md min-h-screen bg-background shadow-2xl overflow-x-hidden relative">
          {children}
        </main>
      </body>
    </html>
  );
}

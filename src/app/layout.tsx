import type { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { AdminAuthProvider } from './admin/AdminAuthProvider';

export const metadata: Metadata = {
  title: 'BonwireKente - Wear Your Heritage',
  description: 'Authentic Ghanaian Kente fabrics, accessories, and ready-to-wear items from BonwireKente.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <AppProvider>
              <AdminAuthProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </div>
                <Toaster />
              </AdminAuthProvider>
            </AppProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

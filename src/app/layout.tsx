import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';
import { cn } from '@/lib/utils';

// Use system fonts as fallback for build environments with network issues
const fontClass = 'font-sans';

export const metadata: Metadata = {
  title: 'Life Logger',
  description: 'An AI-powered journal to capture and understand your life.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontClass
        )}
      >
        <AuthProvider>
            {children}
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dream Constellation - UrAi',
  description: 'Visualize your dreams as spatial constellations based on symbols, mood, and themes.',
};

export default function DreamLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head />
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
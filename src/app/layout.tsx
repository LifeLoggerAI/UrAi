import './globals.css';

export const metadata = {
  title: 'URAI',
  description: 'Your Emotional Media OS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

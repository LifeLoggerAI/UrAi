import './globals.css';
import MainLayout from '../components/layout/MainLayout';

export const metadata = {
  title: 'URAI',
  description: 'Your Emotional Media OS',
};

export default function RootLayout({ children, ...props }) {
  const isOnboarding = props.router?.pathname === '/onboarding';

  return (
    <html lang="en">
      <body>
        {isOnboarding ? children : <MainLayout>{children}</MainLayout>}
      </body>
    </html>
  );
}

import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../context/auth-context';

export const metadata: Metadata = {
  title: 'TeamSync | Weekly Report Generator & Team Dashboard',
  description:
    'Comprehensive team pulse, weekly report submission, review workflow, and manager analytics dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-slate-100 min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

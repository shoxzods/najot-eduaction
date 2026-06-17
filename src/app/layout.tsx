import '../_base.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LMS Sistema',
  description: 'Learning Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

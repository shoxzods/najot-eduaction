import '../_base.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import ToastProvider from '@/components/UI/ToastProvider/ToastProvider';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Najot Edu',
  description: 'Najot Education',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}

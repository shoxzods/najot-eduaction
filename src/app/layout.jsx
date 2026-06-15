import '../_base.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const metadata = {
  title: 'LMS Sistema',
  description: 'Learning Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

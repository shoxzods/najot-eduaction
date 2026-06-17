import MainLayout from '../../layout/MainLayout';
import ProtectRouter from '@/components/protect/ProtectRouter';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectRouter>
      <MainLayout>{children}</MainLayout>
    </ProtectRouter>
  );
}
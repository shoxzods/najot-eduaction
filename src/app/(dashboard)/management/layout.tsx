import Management from '@/views/management/Management';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Management>{children}</Management>;
}
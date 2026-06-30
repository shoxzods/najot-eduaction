import Login from '@/views/Login/Login';
import GuestRoute from '@/components/protect/GuestROute';

export default function Page() {
  return (
    <GuestRoute>
      <Login />
    </GuestRoute>
  );
}
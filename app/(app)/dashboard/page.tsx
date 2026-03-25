import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDashboardData } from '@/features/escrituras/action';
import Dashboard from '@/features/dashboard/pages/Dashboard';

const DashboardPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  const { stats, recentWritings } = await getDashboardData();

  const firstName = session.user.name?.split(' ')[0] ?? 'Usuario';

  return (
    <Dashboard
      userName={firstName}
      stats={stats}
      recentWritings={recentWritings}
    />
  );
};

export default DashboardPage;

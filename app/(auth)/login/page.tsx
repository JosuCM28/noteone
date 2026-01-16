import Login from '@/features/auth/pages/Login';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

const LoginPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (session) {
    return redirect('/dashboard');
  }
  return (
    <Login />
  )
}

export default LoginPage;
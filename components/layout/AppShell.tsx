'use client';
import { ReactNode, useState } from 'react';
// import { useAuth } from '@/features/auth';
import  Sidebar  from './Sidebar';
import  Topbar  from './Topbar';
import { MobileNav } from './MobileNav';
import { Skeleton } from '@/components/ui/skeleton';


export function AppShell({ children }: { children: ReactNode }) {
//   const { isAuthenticated, loading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="space-y-4 w-80">
//           <Skeleton className="h-12 w-full" />
//           <Skeleton className="h-4 w-3/4" />
//           <Skeleton className="h-4 w-1/2" />
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:border-r lg:bg-card lg:block">
        <Sidebar />
      </aside>


      {/* Mobile Navigation */}
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      {/* Main Content */}
       <div className="lg:pl-64">
        <Topbar
          onMenuClick={() => setMobileNavOpen(true)}
          onSearch={setGlobalSearch}
          searchValue={globalSearch}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Scale, LogOut, X } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/escrituras', icon: FileText, label: 'Escrituras' },
  { href: '/usuarios', icon: Users, label: 'Usuarios', adminOnly: true },
];

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();
//   const { isAdmin, logout, user } = useAuth();

  const filteredItems = navItems.filter(item => !item.adminOnly || null);

//   const handleLogout = () => {
//     onOpenChange(false);
//     logout();
//   };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0 bg-sidebar">
        <SheetHeader className="border-b border-sidebar-border px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-amber-600">
              <Scale className="h-5 w-5 text-sidebar" />
            </div>
            <div>
              <SheetTitle className="font-serif text-lg font-semibold text-sidebar-foreground text-left">
                Notaría
              </SheetTitle>
              <p className="text-xs text-sidebar-foreground/60">Sistema de Gestión</p>
            </div>
          </div>
        </SheetHeader>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {filteredItems.map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn('nav-item', isActive && 'active')}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3 mt-auto">
          {/* {user && (
            <div className="mb-3 rounded-lg bg-sidebar-accent p-3">
              <p className="text-sm font-medium text-sidebar-foreground">
                {user.nombre}
              </p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">
                {user.rol}
              </p>
            </div>
          )} */}
          
          <Button
            variant="ghost"
            // onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar sesión
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

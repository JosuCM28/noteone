import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, Scale, LogOut, X, ShieldCheck, Cog } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', adminOnly: false },
  { href: '/escrituras', icon: FileText, label: 'Escrituras', adminOnly: false },
  { href: '/users', icon: Users, label: 'Usuarios', adminOnly: true },
  { href: '/verificar-recibo', icon: ShieldCheck, label: 'Verificar Recibo', adminOnly: false },
  { href: '/settings', icon: Cog, label: 'Configuraciones', adminOnly: false },
];

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole?: string | null;
}

export function MobileNav({ open, onOpenChange, userRole }: MobileNavProps) {
  const pathname = usePathname();
//   const { isAdmin, logout, user } = useAuth();

  const filteredItems = navItems.filter(item => !item.adminOnly || userRole === 'admin');

//   const handleLogout = () => {
//     onOpenChange(false);
//     logout();
//   };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0 border-r border-border/50">
        <SheetHeader className="border-b border-border/50 px-4 py-5 bg-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg shadow-md" style={{background: 'var(--gradient-accent)'}}>
              <Scale className="h-5 w-5" style={{color: 'var(--accent-foreground)'}} />
            </div>
            <div>
              <SheetTitle className="font-serif text-lg font-semibold text-foreground text-left">
                Notaría
              </SheetTitle>
              <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
            </div>
          </div>
        </SheetHeader>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {filteredItems.map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-primary-foreground')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/50 p-3 mt-auto bg-card">
          {/* {user && (
            <div className="mb-3 rounded-lg bg-muted p-3">
              <p className="text-sm font-medium text-foreground">
                {user.nombre}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {user.rol}
              </p>
            </div>
          )} */}

          <Button
            variant="ghost"
            // onClick={handleLogout}
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar sesión
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

import Link from 'next/link';
import { Plus, Menu, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  user: 'Operador',
};

const HIDE_BUTTON_ROUTES = new Set([
  "/dashboard",
  "/escrituras",
  "/usuarios",
]);

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const hideButton = HIDE_BUTTON_ROUTES.has(pathname);
  const router = useRouter();

  const { data: session } = authClient.useSession();
  const userName  = session?.user?.name ?? 'Usuario';
  const firstName = userName.split(' ')[0];
  const userRole  = (session?.user as any)?.role ?? 'user';
  const roleLabel = ROLE_LABELS[userRole] ?? userRole;
  const initials  = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n: string) => n[0].toUpperCase())
    .join('');

  const handleLogOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => router.push("/login"),
        },
      });
    } catch {
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 lg:px-6 shadow-sm">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden shrink-0"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Greeting */}
      <p className="text-sm text-muted-foreground flex-1 min-w-0 truncate">
        Hola, <span className="font-semibold text-foreground">{firstName}</span>, ten un buen día
      </p>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {!hideButton && (
          <Button asChild className="btn-accent hidden sm:inline-flex">
            <Link href="/escrituras/new">
              <Plus className="h-4 w-4 mr-2" />
              Nueva escritura
            </Link>
          </Button>
        )}

        <Button asChild variant="ghost" size="icon" className="sm:hidden">
          <Link href="/escrituras/new">
            <Plus className="h-5 w-5" />
          </Link>
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-1 shrink-0 hover:bg-muted-foreground/10 hover:text-muted-foreground/90">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">{roleLabel}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogOut}
              className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 hover:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

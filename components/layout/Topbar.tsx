import { useState } from 'react';
import Link  from 'next/link';
import { Search, Plus, Menu, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { useAuth } from '@/features/auth';
import { cn } from '@/lib/utils';

interface TopbarProps {
  onMenuClick?: () => void;
  onSearch?: (query: string) => void;
  searchValue?: string;
  showSearch?: boolean;
}

export default function  Topbar({ onMenuClick, onSearch, searchValue = '', showSearch = true }: TopbarProps) {
//   const { user, logout } = useAuth();
  const [localSearch, setLocalSearch] = useState(searchValue);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    onSearch?.(e.target.value);
  };

//   const initials = user?.nombre
//     .split(' ')
//     .map(n => n[0])
//     .slice(0, 2)
//     .join('')
//     .toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      {showSearch && (
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar escrituras, folios, nombres..."
            className="pl-9 input-focus"
            value={localSearch}
            onChange={handleSearchChange}
          />
        </div>
      )}

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button asChild className="btn-accent hidden sm:inline-flex">
          <Link href="/escrituras/nueva">
            <Plus className="h-4 w-4 mr-2" />
            Nueva escritura
          </Link>
        </Button>

        <Button asChild variant="ghost" size="icon" className="sm:hidden">
          <Link href="/escrituras/nueva">
            <Plus className="h-5 w-5" />
          </Link>
        </Button>

        {/* Notifications (mock) */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-1">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {/* {initials} */} JCM
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">Josue</p>
                <p className="text-xs text-muted-foreground capitalize">Administrador</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Mi perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText, Users, Scale, LogOut, Cog } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/escrituras', icon: FileText, label: 'Escrituras' },
    { href: '/users', icon: Users, label: 'Usuarios' },
    { href: '/settings', icon: Cog, label: 'Configuraciones'},
];

interface SidebarProps {
    collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    // const { isAdmin, logout, user } = useAuth();
    const handleLogOut = async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/login");
                    },
                },
            });
        }
        catch (error) {
            console.log(error);
            toast.error('Error al cerrar sesión');
        }

    }
    //   const filteredItems = navItems.filter(item => !item.adminOnly || isAdmin);
    const filteredItems = navItems.filter(item => !item.adminOnly || null);

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen bg-slate-900 transition-all duration-300 shadow-lg',
                collapsed ? 'w-16' : 'w-64'
            )}
        >
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className={cn(
                    'flex items-center gap-3 border-b border-slate-700 px-4 py-5',
                    collapsed && 'justify-center px-2'
                )}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-amber-500 to-amber-600 shadow-lg">
                        <Scale className="h-5 w-5 text-black" />
                    </div>
                    {!collapsed && (
                        <div className="animate-fade-in">
                            <h1 className="text-lg font-semibold text-white">
                                Notaría Uno
                            </h1>
                            <p className="text-xs text-slate-400">Sistema de Gestión</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
                    {filteredItems.map(item => {
                        const isActive = pathname.startsWith(item.href);
                        const NavItem = (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-muted-foreground/30 text-accent shadow-md'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                )}
                            >
                                <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-accent')} />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                        if (collapsed) {
                            return (
                                <Tooltip key={item.href} delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        {NavItem}
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="font-medium bg-slate-900 border-slate-700 text-white">
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }

                        return NavItem;
                    })}
                </nav>

                {/* User section */}
                <div className="border-t border-slate-700 p-3">
                    {/* {!collapsed && user && (
                        <div className="mb-3 rounded-lg bg-slate-800 p-3">
                            <p className="text-sm font-medium text-white">
                                {user.nombre}
                            </p>
                            <p className="text-xs text-slate-400 capitalize">
                                {user.rol}
                            </p>
                        </div>
                    )} */}

                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <form action={handleLogOut}>
                                <Button
                                    variant="ghost"
                                    size={collapsed ? 'icon' : 'default'}
                                    onClick={handleLogOut}
                                    className={cn(
                                        'text-slate-400 hover:text-white hover:bg-slate-800 w-full justify-start',
                                        !collapsed && 'w-full justify-start'
                                    )}
                                >
                                    <LogOut className="h-5 w-5" />
                                    {!collapsed && <span className="ml-3 cursor-pointer">Cerrar sesión</span>}
                                </Button>
                            </form>
                        </TooltipTrigger>
                        {collapsed && (
                            <TooltipContent side="right" className="bg-slate-900 border-slate-700 text-white cursor-pointer">
                                Cerrar sesión
                            </TooltipContent>
                        )}
                    </Tooltip>
                </div>
            </div>
        </aside>
    );
}

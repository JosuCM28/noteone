'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText, Users, Scale, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/escrituras', icon: FileText, label: 'Escrituras' },
    { href: '/usuarios', icon: Users, label: 'Usuarios', adminOnly: true },
];

interface SidebarProps {
    collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
    const pathname = usePathname();
    // const { isAdmin, logout, user } = useAuth();

    //   const filteredItems = navItems.filter(item => !item.adminOnly || isAdmin);
    const filteredItems = navItems.filter(item => !item.adminOnly || null);

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 z-40 h-screen bg-sidebar-accent-foreground transition-all duration-300 shadow-lg',
                collapsed ? 'w-16' : 'w-64'
            )}
        >
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className={cn(
                    'flex items-center gap-3 border-b border-sidebar-border px-4 py-5',
                    collapsed && 'justify-center px-2'
                )}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-accent to-amber-600">
                        <Scale className="h-5 w-5 text-sidebar-primary"/>
                    </div>
                    {!collapsed && (
                        <div className="animate-fade-in">
                            <h1 className=" text-lg font-semibold text-sidebar">
                                Notaría
                            </h1>
                            <p className="text-xs text-sidebar/60">Sistema de Gestión</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {filteredItems.map(item => {
                        const isActive = pathname.startsWith(item.href);
                        const NavItem = (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn('nav-item ', isActive && 'text-accent bg-muted-foreground/30')}
                            >
                                <item.icon className="size-5 shrink-0 text" />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                        if (collapsed) {
                            return (
                                <Tooltip key={item.href} delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        {NavItem}
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="font-medium">
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }

                        return NavItem;
                    })}
                </nav>

                {/* User section */}
                <div className="border-t border-sidebar-border p-3">
                    {/* {!collapsed && user && (
                        <div className="mb-3 rounded-lg bg-sidebar-accent p-3">
                            <p className="text-sm font-medium text-sidebar-foreground">
                                {user.nombre}
                            </p>
                            <p className="text-xs text-sidebar-foreground/60 capitalize">
                                {user.rol}
                            </p>
                        </div>
                    )} */}

                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size={collapsed ? 'icon' : 'default'}
                                // onClick={logout}
                                className={cn(
                                    'text-sidebar-primary-foreground/70 hover:text-sidebar-accent/90 hover:bg-muted-foreground/20 cursor-pointer',
                                    !collapsed && 'w-full justify-start'
                                )}
                            >
                                <LogOut className="h-5 w-5" />
                                {!collapsed && <span className="ml-3">Cerrar sesión</span>}
                            </Button>
                        </TooltipTrigger>
                        {collapsed && (
                            <TooltipContent side="right">
                                Cerrar sesión
                            </TooltipContent>
                        )}
                    </Tooltip>
                </div>
            </div>
        </aside>
    );
}

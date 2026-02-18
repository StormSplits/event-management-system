"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    Calendar,
    Users,
    Settings,
    LogOut,
    ShieldCheck,
    LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signout } from "@/app/auth/actions";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Events",
        href: "/admin/events",
        icon: Calendar,
    },
    {
        title: "Participants",
        href: "/admin/participants",
        icon: Users,
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <div className={cn("hidden border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-50", className)}>
            <div className="flex h-16 items-center px-6 border-b border-neutral-200 dark:border-neutral-800">
                <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <ShieldCheck className="h-6 w-6" />
                    <span>AdminPortal</span>
                </Link>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto py-4">
                <nav className="grid gap-1 px-4">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10"
                        onClick={() => signout()}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}

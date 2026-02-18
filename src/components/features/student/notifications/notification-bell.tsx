"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNotifications } from "./actions";
import Link from "next/link";

export function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNotifications() {
            try {
                const data = await getNotifications();
                setNotifications(data);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            } finally {
                setLoading(false);
            }
        }

        fetchNotifications();

        // Poll every minute for updates (optional)
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <Button variant="ghost" size="icon" className="relative text-neutral-500">
                <Bell className="h-5 w-5 opacity-50" />
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50">
                    <Bell className="h-5 w-5" />
                    {notifications.length > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-neutral-950 animate-pulse" />
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-neutral-500">
                        No new notifications.
                    </div>
                ) : (
                    notifications.map((event) => (
                        <DropdownMenuItem key={event.id} asChild>
                            <Link href={`/feed`} className="flex flex-col gap-1 items-start cursor-pointer p-3">
                                <span className="font-semibold text-sm">{event.title}</span>
                                <span className="text-xs text-neutral-500">
                                    Starts in {Math.ceil((new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60))} hours
                                </span>
                            </Link>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

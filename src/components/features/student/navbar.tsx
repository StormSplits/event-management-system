"use client";

import Link from "next/link";
import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { signout } from "@/app/auth/actions";
import { NotificationBell } from "./notifications/notification-bell";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface StudentNavbarProps {
    user: SupabaseUser | null;
}

export function StudentNavbar({ user }: StudentNavbarProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
            <div className="container flex h-16 items-center justify-between mx-auto px-4">
                <div className="flex items-center gap-4 md:gap-8">
                    <Link href="/feed" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <span className="hidden md:inline-block">CampusEvents</span>
                        <span className="md:hidden">CE</span>
                    </Link>

                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {user ? (
                        <>
                            <NotificationBell />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800">
                                        <User className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
                                        <span className="sr-only">User menu</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="w-full cursor-pointer">
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/registrations" className="w-full cursor-pointer">
                                            My Registrations
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600 dark:text-red-400 focus:text-red-600 cursor-pointer"
                                        onClick={() => signout()}
                                    >
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost">
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

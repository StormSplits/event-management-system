"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useActionState } from 'react'

export function LoginForm({ className }: { className?: string }) {
    const [role, setRole] = React.useState<"admin" | "student">("student");
    const [state, formAction, isPending] = useActionState(login, null)

    return (
        <div className={cn("grid gap-6", className)}>
            <Card className="w-full max-w-[440px] shadow-lg border-0 ring-1 ring-neutral-200 dark:ring-neutral-800">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
                        {role === "student" ? (
                            <GraduationCap className="h-6 w-6 text-secondary" />
                        ) : (
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        )}
                    </div>
                    <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>
                        Sign in to your {role === "admin" ? "admin" : "student"} account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <Tabs
                        defaultValue="student"
                        onValueChange={(val) => setRole(val as "admin" | "student")}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="student">Student</TabsTrigger>
                            <TabsTrigger value="admin">Admin</TabsTrigger>
                        </TabsList>

                        <form action={formAction}>
                            {state?.error && typeof state.error === 'string' && (
                                <div className="mb-4 text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">
                                    {state.error}
                                </div>
                            )}
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder={
                                            role === "student"
                                                ? "student@college.edu"
                                                : "admin@college.edu"
                                        }
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm font-medium text-primary hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="current-password"
                                        required
                                    />
                                </div>
                                <Button
                                    disabled={isPending}
                                    className={cn(
                                        "w-full mt-2 transition-colors",
                                        role === "student"
                                            ? "bg-secondary hover:bg-secondary/90 text-neutral-900"
                                            : "bg-primary hover:bg-primary-dark text-white"
                                    )}
                                >
                                    {isPending ? "Logging in..." : `Login as ${role === "student" ? "Student" : "Admin"}`}
                                </Button>
                            </div>
                        </form>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 text-center">
                    <div className="text-sm text-neutral-500">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-primary hover:underline"
                        >
                            Register
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

import { login } from "@/app/auth/actions";


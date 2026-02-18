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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useActionState } from 'react'

export function RegisterForm({ className }: { className?: string }) {
    const [role, setRole] = React.useState<"admin" | "student">("student");
    const [state, formAction, isPending] = useActionState(signup, null)

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
                    <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
                    <CardDescription>
                        Join as a {role === "admin" ? "admin" : "student"} to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        name="fullName"
                                        placeholder="John Doe"
                                        type="text"
                                        autoCapitalize="words"
                                        autoComplete="name"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="id">{role === 'student' ? 'Student ID' : 'Employee ID'}</Label>
                                    <Input
                                        id="id"
                                        name="identifier"
                                        placeholder={role === 'student' ? "ST-2026-001" : "EMP-001"}
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder={role === 'student' ? "student@college.edu" : "admin@college.edu"}
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        required
                                    />
                                </div>
                                {role === 'student' && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="department">Department</Label>
                                        <Select name="department">
                                            <SelectTrigger id="department">
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cs">Computer Science</SelectItem>
                                                <SelectItem value="eng">Engineering</SelectItem>
                                                <SelectItem value="arts">Arts & Humanities</SelectItem>
                                                <SelectItem value="business">Business</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        required
                                    />
                                </div>
                                <Button
                                    disabled={isPending}
                                    className={cn(
                                        "w-full mt-2",
                                        role === "student"
                                            ? "bg-secondary hover:bg-secondary/90 text-neutral-900"
                                            : "bg-primary hover:bg-primary-dark text-white"
                                    )}
                                >
                                    {isPending ? "Registering..." : "Register"}
                                </Button>
                            </div>
                        </form>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 text-center">
                    <div className="text-sm text-neutral-500">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:underline"
                        >
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

import { signup } from "@/app/auth/actions";

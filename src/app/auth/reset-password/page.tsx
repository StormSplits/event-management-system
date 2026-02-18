"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
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
import { createClient } from "@/lib/supabase/client";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const errorParam = searchParams.get("error");
    const errorCode = searchParams.get("error_code");
    const errorDescription = searchParams.get("error_description");

    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const hasLinkError = !!errorParam;

    async function onSubmit(event: React.FormEvent) {
        event.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        try {
            const supabase = createClient();
            const { error: updateError } = await supabase.auth.updateUser({ password });

            if (updateError) {
                setError(updateError.message);
            } else {
                setIsSuccess(true);
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    // Expired / invalid link error state
    if (hasLinkError) {
        const friendlyMessage =
            errorCode === "otp_expired"
                ? "This password reset link has expired or has already been used."
                : (errorDescription?.replace(/\+/g, " ") ?? "The reset link is invalid.");

        return (
            <Card className="w-full max-w-[440px] shadow-lg border-0 ring-1 ring-neutral-200 dark:ring-neutral-800">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 mb-4">
                        <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Link Expired</CardTitle>
                    <CardDescription>{friendlyMessage}</CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col gap-3 pt-4">
                    <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                        <Link href="/forgot-password">Request a New Reset Link</Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full">
                        <Link href="/login">Back to Login</Link>
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    // Success state
    if (isSuccess) {
        return (
            <Card className="w-full max-w-[440px] shadow-lg border-0 ring-1 ring-neutral-200 dark:ring-neutral-800">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Password Updated</CardTitle>
                    <CardDescription>
                        Your password has been changed successfully.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="pt-4">
                    <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                        <Link href="/login">Sign In</Link>
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    // Normal reset form
    return (
        <Card className="w-full max-w-[440px] shadow-lg border-0 ring-1 ring-neutral-200 dark:ring-neutral-800">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
                    <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
                <CardDescription>Enter your new password below.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                                required
                                minLength={6}
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-2 bg-primary hover:bg-primary/90 text-white"
                        >
                            {isLoading && (
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            )}
                            Update Password
                        </Button>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 text-center">
                <div className="text-sm text-neutral-500">
                    <Link
                        href="/login"
                        className="font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                    >
                        Back to Login
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-4">
            <React.Suspense
                fallback={
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                }
            >
                <ResetPasswordContent />
            </React.Suspense>
        </div>
    );
}

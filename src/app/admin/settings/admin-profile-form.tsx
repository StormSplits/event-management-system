"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/(student)/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function AdminProfileForm({ currentName }: { currentName: string }) {
    const [state, formAction, isPending] = useActionState(updateProfile, null);

    return (
        <form action={formAction} className="space-y-4">
            {state?.error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{state.error}</span>
                </div>
            )}
            {state?.success && (
                <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Name updated successfully!</span>
                </div>
            )}

            <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    id="fullName"
                    name="fullName"
                    defaultValue={currentName}
                    placeholder="Your full name"
                    required
                />
            </div>

            {/* Hidden field for avatarUrl (required by updateProfile action) */}
            <input type="hidden" name="avatarUrl" value="" />

            <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
}

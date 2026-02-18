"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfile } from "@/app/(student)/profile/actions";
import { User } from "lucide-react";

interface ProfileFormProps {
    user: any;
    profile: any;
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
    const [state, formAction, isPending] = useActionState(updateProfile, null);

    return (
        <form action={formAction} className="space-y-6">
            <div className="flex flex-col items-center gap-4 mb-8">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-2xl">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                {/* 
                  File Upload with Base64 conversion (max 100kb)
                  This avoids needing a storage bucket for now, but is limited in size.
                */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="avatarFile">Profile Image (Max 100KB)</Label>
                    <div className="flex items-center gap-4">
                        <Input
                            type="file"
                            id="avatarFile"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    if (file.size > 100 * 1024) {
                                        alert("File size must be less than 100KB");
                                        e.target.value = "";
                                        return;
                                    }
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        const base64String = reader.result as string;
                                        const hiddenInput = document.getElementById("avatarUrl") as HTMLInputElement;
                                        if (hiddenInput) hiddenInput.value = base64String;

                                        // Update the avatar preview immediately manually
                                        const avatarImage = document.querySelector('[data-radix-avatar-image]') as HTMLImageElement;
                                        if (avatarImage) avatarImage.src = base64String;
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        <Label
                            htmlFor="avatarFile"
                            className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80 h-10 px-4 py-2"
                        >
                            Choose File
                        </Label>
                        <span className="text-sm text-neutral-500">
                            Max 100KB
                        </span>
                    </div>
                    <Input
                        type="hidden"
                        name="avatarUrl"
                        id="avatarUrl"
                        defaultValue={profile?.avatar_url || ""}
                    />
                    <p className="text-xs text-neutral-500">Upload a small image to personalize your profile.</p>
                </div>
            </div>

            {state?.error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                    {state.error}
                </div>
            )}
            {state?.success && (
                <div className="p-3 text-sm text-green-500 bg-green-50 border border-green-200 rounded-md">
                    Profile updated successfully!
                </div>
            )}

            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        name="fullName"
                        defaultValue={profile?.full_name || ""}
                        placeholder="John Doe"
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                    />
                    <p className="text-xs text-neutral-500">Email cannot be changed.</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="id">User ID (Event ID)</Label>
                    <Input
                        id="id"
                        value={user.id}
                        disabled
                        className="font-mono text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                    />
                    <p className="text-xs text-neutral-500">This is your unique reference ID.</p>
                </div>
            </div>

            <div className="pt-4">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Updating..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}

import { createClient } from "@/lib/supabase/server";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { User, Mail, ShieldCheck } from "lucide-react";
import { AdminProfileForm } from "./admin-profile-form";

export default async function AdminSettingsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-neutral-900 dark:text-white">
                    Settings
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Manage your admin account settings.
                </p>
            </div>

            <div className="grid gap-6 max-w-2xl">
                {/* Edit Profile */}
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Profile</CardTitle>
                        <CardDescription>Update your display name.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AdminProfileForm currentName={profile?.full_name || ""} />
                    </CardContent>
                </Card>

                {/* Account Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>Your account details from Supabase Auth.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                                <Mail className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500">Email</p>
                                <p className="text-sm font-medium">{user?.email || "—"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/20">
                                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500">Role</p>
                                <p className="text-sm font-medium capitalize">{profile?.role || "admin"}</p>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">User ID</span>
                                <span className="font-mono text-xs text-neutral-700 dark:text-neutral-300">{user?.id}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Last Sign In</span>
                                <span className="text-neutral-700 dark:text-neutral-300">
                                    {user?.last_sign_in_at
                                        ? new Date(user.last_sign_in_at).toLocaleString()
                                        : "—"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Account Created</span>
                                <span className="text-neutral-700 dark:text-neutral-300">
                                    {user?.created_at
                                        ? new Date(user.created_at).toLocaleDateString()
                                        : "—"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

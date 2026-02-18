import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/features/student/profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-heading font-bold text-neutral-900 dark:text-white">
                    My Profile
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Manage your personal information.
                </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <ProfileForm user={user} profile={profile} />
            </div>
        </div>
    );
}

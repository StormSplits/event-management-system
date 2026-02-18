import { StudentNavbar } from "@/components/features/student/navbar";
import { createClient } from "@/lib/supabase/server";

export default async function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <StudentNavbar user={user} />
            <main className="flex-1 container py-8">
                {children}
            </main>
        </div>
    );
}

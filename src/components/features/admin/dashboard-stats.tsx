import { Users, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export async function DashboardStats() {
    const supabase = await createClient();

    // Fetch total students (profiles with role 'student')
    const { count: totalStudents } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

    // Fetch active events (events with date >= today)
    const { count: activeEvents } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('date', new Date().toISOString());

    // Fetch total registrations
    const { count: totalRegistrations } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });

    // Calculate engagement rate (registrations / students * 100)
    const engagementRate =
        totalStudents && totalStudents > 0
            ? Math.round(((totalRegistrations || 0) / totalStudents) * 100)
            : 0;

    const stats = [
        {
            title: "Total Students",
            value: (totalStudents || 0).toLocaleString(),
            change: "Registered users",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
            title: "Active Events",
            value: (activeEvents || 0).toString(),
            change: "Upcoming events",
            icon: Calendar,
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
        },
        {
            title: "Registrations",
            value: (totalRegistrations || 0).toLocaleString(),
            change: "Total sign-ups",
            icon: CheckCircle2,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/20",
        },
        {
            title: "Engagement Rate",
            value: `${engagementRate}%`,
            change: "Registrations per student",
            icon: TrendingUp,
            color: "text-amber-600",
            bgColor: "bg-amber-100 dark:bg-amber-900/20",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                            {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-full ${stat.bgColor}`}>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-neutral-500 mt-1">{stat.change}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

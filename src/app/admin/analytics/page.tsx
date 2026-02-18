import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Calendar, CheckCircle2, Users, UserPlus, Trophy, Activity } from "lucide-react";

export default async function AnalyticsPage() {
    const supabase = await createClient();

    // 1. Fetch Events Stats
    const { data: events } = await supabase.from('events').select('id, date, registrations(count)');
    const totalEvents = events?.length || 0;

    const now = new Date();
    const activeEvents = events?.filter(e => new Date(e.date) > now).length || 0;
    const completedEvents = events?.filter(e => new Date(e.date) <= now).length || 0;

    // 2. Fetch Registration Stats
    const { count: totalRegistrations } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true });

    // 3. Fetch User Stats
    // Profiles count approximates total accounts created
    const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    // Users with at least one registration
    // This requires a distinct query or RPC. For now, we can approximate or use a raw query if enabled.
    // Simpler approach with JS for small-medium scale:
    const { data: distinctRegUsers } = await supabase
        .from('registrations')
        .select('user_id');
    const uniqueActiveUsers = new Set(distinctRegUsers?.map(r => r.user_id)).size;

    // 4. Detailed Event Performance
    // Re-fetch full event details for the table if needed, or use the previously fetched partial data
    // We need title and capacity too
    const { data: detailedEvents } = await supabase
        .from('events')
        .select(`
            id,
            title,
            category,
            capacity,
            date,
            registrations (count)
        `)
        .order('date', { ascending: false });

    const stats = [
        {
            title: "Total Events",
            value: totalEvents,
            icon: Calendar,
            desc: "All time events created",
        },
        {
            title: "Active Events",
            value: activeEvents,
            icon: Activity,
            desc: "Upcoming events",
        },
        {
            title: "Completed Events",
            value: completedEvents,
            icon: CheckCircle2,
            desc: "Past events",
        },
        {
            title: "Total Registrations",
            value: totalRegistrations || 0,
            icon: Trophy,
            desc: "Across all events",
        },
        {
            title: "Total Users",
            value: totalUsers || 0,
            icon: Users,
            desc: "Registered accounts",
        },
        {
            title: "Active Participants",
            value: uniqueActiveUsers,
            icon: UserPlus,
            desc: "Users with ≥1 registration",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-neutral-900 dark:text-white">
                    Analytics Dashboard
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Platform performance and event statistics.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-neutral-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-neutral-500">
                                {stat.desc}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-heading font-semibold">Event Performance</h2>
                <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Registrations</TableHead>
                                <TableHead>Fill Rate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {detailedEvents?.map((event: any) => {
                                const regCount = event.registrations?.[0]?.count || 0;
                                const fillRate = event.capacity > 0 ? Math.round((regCount / event.capacity) * 100) : 0;

                                return (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium">{event.title}</TableCell>
                                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{event.category}</TableCell>
                                        <TableCell>{regCount} / {event.capacity}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-24 bg-neutral-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${fillRate >= 100 ? 'bg-red-500' : fillRate >= 80 ? 'bg-amber-500' : 'bg-green-500'}`}
                                                        style={{ width: `${Math.min(fillRate, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-neutral-500">{fillRate}%</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

import { DashboardStats } from "@/components/features/admin/dashboard-stats";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // Fetch recent registrations
    const { data: recentRegistrations } = await supabase
        .from('registrations')
        .select(`
            created_at,
            events (title),
            profiles (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

    // Fetch upcoming events
    const { data: upcomingEvents } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(5);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-neutral-900 dark:text-white">
                        Admin Dashboard
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Overview of campus event activities.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/events">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                    </Link>
                </Button>
            </div>

            <DashboardStats />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Registrations</CardTitle>
                        <CardDescription>
                            Latest students who registered for events.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentRegistrations?.map((reg: any, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-neutral-100 last:border-0 pb-2 last:pb-0">
                                    <div>
                                        <p className="text-sm font-medium">{reg.profiles?.full_name || 'Unknown Student'}</p>
                                        <p className="text-xs text-neutral-500">registered for {reg.events?.title || 'Unknown Event'}</p>
                                    </div>
                                    <div className="text-xs text-neutral-400">
                                        {new Date(reg.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                            {(!recentRegistrations || recentRegistrations.length === 0) && (
                                <div className="text-sm text-neutral-500 text-center py-4">No recent registrations</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                        <CardDescription>
                            Events scheduled for this week.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {upcomingEvents?.map((event, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                        {new Date(event.date).getDate()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{event.title}</p>
                                        <p className="text-xs text-neutral-500">{event.location}</p>
                                    </div>
                                </div>
                            ))}
                            {(!upcomingEvents || upcomingEvents.length === 0) && (
                                <div className="text-sm text-neutral-500 text-center py-4">No upcoming events</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

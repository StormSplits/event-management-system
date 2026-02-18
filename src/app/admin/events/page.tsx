import { createClient } from "@/lib/supabase/server";
import { AdminEventForm } from "./admin-event-form";
import { DeleteEventButton } from "./delete-event-button";
import { EditEventButton } from "./edit-event-button";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function AdminEventsPage() {
    const supabase = await createClient();

    const now = new Date().toISOString();

    // Fetch upcoming events with full data for editing
    const { data: upcomingEvents, error } = await supabase
        .from('events')
        .select(`
            id, title, description, rules, date, location, category, capacity,
            image_url, registration_deadline,
            registrations (count)
        `)
        .gte('date', now)
        .order('date', { ascending: true });

    // Fetch past events
    const { data: pastEventsRaw } = await supabase
        .from('events')
        .select(`
            id, title, description, rules, date, location, category, capacity,
            image_url, registration_deadline,
            registrations (count)
        `)
        .lt('date', now)
        .order('date', { ascending: false })
        .limit(20);

    if (error) {
        console.error("Error fetching events", error);
    }

    const EventRow = ({ event, isPast = false }: { event: any, isPast?: boolean }) => (
        <TableRow className={isPast ? "opacity-60" : ""}>
            <TableCell className="font-medium">{event.title}</TableCell>
            <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
            <TableCell>
                <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800">
                    {event.category}
                </span>
            </TableCell>
            <TableCell>
                {event.registrations?.[0]?.count || 0} / {event.capacity}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/events/${event.id}/participants`}>Participants</Link>
                    </Button>
                    {!isPast && (
                        <EditEventButton event={{
                            id: event.id,
                            title: event.title,
                            description: event.description,
                            rules: event.rules,
                            date: event.date,
                            location: event.location,
                            category: event.category,
                            capacity: event.capacity,
                            image_url: event.image_url,
                            registration_deadline: event.registration_deadline,
                        }} />
                    )}
                    <DeleteEventButton eventId={event.id} />
                </div>
            </TableCell>
        </TableRow>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-neutral-900 dark:text-white">
                        Events Management
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Create and manage campus events.
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Event</DialogTitle>
                            <DialogDescription>
                                Fill in the details to publish a new event.
                            </DialogDescription>
                        </DialogHeader>
                        <AdminEventForm />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Upcoming Events */}
            <div>
                <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                    Upcoming Events ({upcomingEvents?.length || 0})
                </h2>
                <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Registrations</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(upcomingEvents || []).map((event) => (
                                <EventRow key={event.id} event={event} />
                            ))}
                            {(!upcomingEvents || upcomingEvents.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-neutral-500">
                                        No upcoming events. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Past Events */}
            {pastEventsRaw && pastEventsRaw.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                        Past Events ({pastEventsRaw.length})
                    </h2>
                    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Event Name</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Registrations</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pastEventsRaw.map((event) => (
                                    <EventRow key={event.id} event={event} isPast />
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    );
}

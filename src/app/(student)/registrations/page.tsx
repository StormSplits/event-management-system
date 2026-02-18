import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/features/student/event-card";
import { EventDetailModal } from "@/components/features/student/event-detail-modal";
import { redirect } from "next/navigation";
import { UnregisterButton } from "@/components/features/student/unregister-button";

export default async function MyRegistrationsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch registrations for the current user
    const { data: registrations, error } = await supabase
        .from('registrations')
        .select(`
            event:events (
                *,
                registrations (count)
            )
        `)
        .eq('user_id', user.id);

    if (error) {
        console.error("Error fetching registrations", error);
    }

    const formattedEvents = (registrations || []).map((reg: any) => {
        const event = reg.event;
        const isPast = new Date(event.date) < new Date();
        return {
            id: event.id,
            title: event.title,
            description: event.description,
            date: new Date(event.date).toLocaleDateString(),
            time: new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: event.location,
            category: event.category,
            organizer: "College",
            registered: event.registrations?.[0]?.count || 0,
            capacity: event.capacity,
            image: event.image_url,
            rules: event.rules,
            registration_deadline: event.registration_deadline,
            isPast,
            isAlreadyRegistered: true,
        };
    });

    const upcoming = formattedEvents.filter(e => !e.isPast);
    const past = formattedEvents.filter(e => e.isPast);

    const EventGrid = ({ events, label }: { events: typeof formattedEvents, label: string }) => (
        <div className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">{label} ({events.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="relative group">
                        <EventDetailModal event={{ ...event, image: event.image || "/placeholder" }}>
                            <div className="cursor-pointer h-full">
                                <EventCard
                                    {...event}
                                    image={event.image || "/placeholder"}
                                    isPast={event.isPast}
                                    isRegistered={true}
                                />
                            </div>
                        </EventDetailModal>
                        {!event.isPast && (
                            <div className="mt-2 text-center">
                                <UnregisterButton eventId={event.id} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-heading font-bold text-neutral-900 dark:text-white">
                    My Registrations
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Events you are registered for.
                </p>
            </div>

            {formattedEvents.length === 0 ? (
                <div className="text-center py-20 text-neutral-500 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                    <p>You haven&apos;t registered for any events yet.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {upcoming.length > 0 && <EventGrid events={upcoming} label="Upcoming" />}
                    {past.length > 0 && <EventGrid events={past} label="Past Events" />}
                </div>
            )}
        </div>
    );
}

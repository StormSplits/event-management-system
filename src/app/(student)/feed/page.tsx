import { FeedView } from "@/components/features/student/feed-view";
import { createClient } from "@/lib/supabase/server";

export default async function FeedPage() {
    const supabase = await createClient();

    const now = new Date().toISOString();

    // Fetch upcoming events (from now onwards)
    const { data: upcomingEvents, error } = await supabase
        .from('events')
        .select(`
            *,
            registrations (count)
        `)
        .gte('date', now)
        .order('date', { ascending: true });

    if (error) {
        console.error("Error fetching events", error);
    }

    // Fetch past events
    const { data: pastEventsData } = await supabase
        .from('events')
        .select(`
            *,
            registrations (count)
        `)
        .lt('date', now)
        .order('date', { ascending: false })
        .limit(20);

    // Fetch categories dynamically (all events)
    const { data: categoryData } = await supabase
        .from('events')
        .select('category');

    // Extract unique categories
    const uniqueCategories = Array.from(new Set(categoryData?.map(item => item.category) || [])).sort();

    // Fetch the current user's registrations to show "Registered" state on cards
    const { data: { user } } = await supabase.auth.getUser();
    let userRegisteredIds: string[] = [];
    if (user) {
        const { data: userRegs } = await supabase
            .from('registrations')
            .select('event_id')
            .eq('user_id', user.id);
        userRegisteredIds = (userRegs || []).map((r: any) => r.event_id);
    }

    const formatEvent = (event: any) => ({
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
        registration_deadline: event.registration_deadline
    });

    const formattedUpcoming = (upcomingEvents || []).map(formatEvent);
    const formattedPast = (pastEventsData || []).map(formatEvent);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-heading font-bold text-neutral-900 dark:text-white">
                    Campus Events
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    Discover and register for the latest happenings on campus.
                </p>
            </div>

            <FeedView
                initialEvents={formattedUpcoming}
                pastEvents={formattedPast}
                categories={uniqueCategories}
                userRegisteredIds={userRegisteredIds}
            />
        </div>
    );
}

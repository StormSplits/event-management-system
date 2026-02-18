'use server'

import { createClient } from "@/lib/supabase/server";

export async function getNotifications() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Notifications Logic:
    // 1. Get all registrations for the user
    // 2. Filter events that are starting within 24 hours from now
    // 3. AND haven't started yet (optional, but "1 day left" usually means upcoming)

    // We'll calculate the range: Now to Now + 24h
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: registrations, error } = await supabase
        .from('registrations')
        .select(`
            event:events (
                id,
                title,
                date,
                image_url
            )
        `)
        .eq('user_id', user.id)
        .gte('event.date', now.toISOString())
        .lte('event.date', tomorrow.toISOString())
    // Note: Filtering on joined table columns in Supabase/PostgREST can be tricky with inner joins.
    // It's often safer to fetch registrations and filter in application or use specific syntax if enabled.
    // Let's try to fetch active registrations and filter in JS for reliability given the complex date logic.

    // Simpler query: Get all upcoming registrations
    const { data: allRegistrations } = await supabase
        .from('registrations')
        .select(`
            event:events (
                id,
                title,
                date,
                image_url
            )
        `)
        .eq('user_id', user.id);

    if (!allRegistrations) return [];

    const upcomingNotifications = allRegistrations
        .map((reg: any) => reg.event)
        .filter((event: any) => {
            if (!event || !event.date) return false;
            const eventDate = new Date(event.date);
            const timeDiff = eventDate.getTime() - now.getTime();
            const oneDayInMs = 24 * 60 * 60 * 1000;

            // Check if event is within the next 24 hours and hasn't passed more than 1 hour (ongoing)
            return timeDiff > 0 && timeDiff <= oneDayInMs;
        });

    return upcomingNotifications;
}

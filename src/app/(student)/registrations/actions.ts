'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function unregisterEvent(eventId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'User not authenticated' };
    }

    const { error } = await supabase
        .from('registrations')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/registrations');
    revalidatePath('/feed');
    revalidatePath(`/events/${eventId}`);
    return { success: true };
}

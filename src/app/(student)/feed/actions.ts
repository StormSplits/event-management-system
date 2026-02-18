'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function registerForEvent(eventId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'User not authenticated' }
    }

    const { error } = await supabase
        .from('registrations')
        .insert({
            user_id: user.id,
            event_id: eventId,
        })

    if (error) {
        if (error.code === '23505') { // Unique violation
            return { error: 'You are already registered for this event.' }
        }
        return { error: error.message }
    }

    // Update capacity (optional, if we were tracking it in events table, but we can just count registrations)
    // For now, simple registration.

    revalidatePath('/feed')
    revalidatePath(`/events/${eventId}`)
    return { success: true }
}

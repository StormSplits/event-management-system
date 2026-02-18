'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const eventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    rules: z.string().optional(),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    registration_deadline: z.string().optional(),
    location: z.string().min(1, "Location is required"),
    category: z.string().min(1, "Category is required"),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
    image_url: z.string().optional(), // In production, validate URL format
});

export async function createEvent(prevState: any, formData: FormData) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: "Unauthorized" };

    // Validate Data
    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        rules: formData.get('rules'),
        date: formData.get('date'),
        time: formData.get('time'),
        registration_deadline: formData.get('registration_deadline'),
        location: formData.get('location'),
        category: formData.get('category'),
        capacity: formData.get('capacity'),
        image_url: formData.get('image_url'),
    };

    const validatedFields = eventSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { date, time, ...rest } = validatedFields.data;

    // Combine Date and Time
    const eventDateTime = new Date(`${date}T${time}`).toISOString();

    // Parse Registration Deadline if exists
    let deadlineIso = null;
    if (rest.registration_deadline) {
        deadlineIso = new Date(rest.registration_deadline).toISOString();
    }

    // Handle Image: Prefer Base64, fallback to URL
    let finalImageUrl = formData.get('image_url') as string;
    const base64Image = formData.get('image_base64') as string;

    if (base64Image && base64Image.startsWith('data:image')) {
        finalImageUrl = base64Image;
    }

    // Basic size check (though redundant if clientside didn't send it)
    if (finalImageUrl && finalImageUrl.length > 300000) { // ~300KB to be safe with base64 overhead
        return { error: "Image size too large (Server check). Please use a smaller image." };
    }

    const { error } = await supabase
        .from('events')
        .insert({
            ...rest,
            date: eventDateTime,
            registration_deadline: deadlineIso,
            image_url: finalImageUrl,
        });

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/admin/events');
    revalidatePath('/feed');
    return { success: true };
}

export async function deleteEvent(eventId: string) {
    const supabase = await createClient();

    // Auth Check (should be middleware protected too, but double check)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: "Unauthorized" };

    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

    if (error) return { error: error.message };

    revalidatePath('/admin/events');
    revalidatePath('/feed');
    return { success: true };
}

export async function updateEvent(eventId: string, prevState: any, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: "Unauthorized" };

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        rules: formData.get('rules'),
        date: formData.get('date'),
        time: formData.get('time'),
        registration_deadline: formData.get('registration_deadline'),
        location: formData.get('location'),
        category: formData.get('category'),
        capacity: formData.get('capacity'),
        image_url: formData.get('image_url'),
    };

    const validatedFields = eventSchema.safeParse(rawData);
    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors };
    }

    const { date, time, ...rest } = validatedFields.data;
    const eventDateTime = new Date(`${date}T${time}`).toISOString();

    let deadlineIso = null;
    if (rest.registration_deadline) {
        deadlineIso = new Date(rest.registration_deadline).toISOString();
    }

    let finalImageUrl = formData.get('image_url') as string;
    const base64Image = formData.get('image_base64') as string;
    if (base64Image && base64Image.startsWith('data:image')) {
        finalImageUrl = base64Image;
    }

    if (finalImageUrl && finalImageUrl.length > 300000) {
        return { error: "Image size too large. Please use a smaller image." };
    }

    const { error } = await supabase
        .from('events')
        .update({
            ...rest,
            date: eventDateTime,
            registration_deadline: deadlineIso,
            image_url: finalImageUrl || null,
        })
        .eq('id', eventId);

    if (error) return { error: error.message };

    revalidatePath('/admin/events');
    revalidatePath('/feed');
    return { success: true };
}

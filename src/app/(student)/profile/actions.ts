'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'User not authenticated' };
    }

    const fullName = formData.get('fullName') as string;
    const avatarUrl = formData.get('avatarUrl') as string;

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: fullName,
            avatar_url: avatarUrl // Assuming text URL for now, or handle upload separately
        })
        .eq('id', user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath('/profile');
    return { success: true };
}

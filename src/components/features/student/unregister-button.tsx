"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { unregisterEvent } from "@/app/(student)/registrations/actions";
import { useRouter } from "next/navigation";

export function UnregisterButton({ eventId }: { eventId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleUnregister() {
        if (!confirm("Are you sure you want to unregister from this event?")) return;

        setLoading(true);
        try {
            const res = await unregisterEvent(eventId);
            if (res.error) {
                alert(res.error);
            }
            // Router refresh handled by server action revalidates
        } catch (error) {
            console.error("Unregistration failed", error);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={handleUnregister}
            disabled={loading}
        >
            {loading ? "Rolling out..." : "Rollout (Unregister)"}
        </Button>
    );
}

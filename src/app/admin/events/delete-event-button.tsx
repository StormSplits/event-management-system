"use client";

import { useTransition } from "react";
import { deleteEvent } from "./actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteEventButton({ eventId }: { eventId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
        startTransition(async () => {
            await deleteEvent(eventId);
        });
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
            onClick={handleDelete}
            disabled={isPending}
        >
            <Trash2 className="h-4 w-4" />
            {isPending ? "Deleting..." : "Delete"}
        </Button>
    );
}

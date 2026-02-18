"use client";

import { useActionState, useState, ChangeEvent } from "react";
import { updateEvent } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, X, ImageIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface EditEventButtonProps {
    event: {
        id: string;
        title: string;
        description?: string;
        rules?: string;
        date: string; // ISO string
        location: string;
        category: string;
        capacity: number;
        image_url?: string;
        registration_deadline?: string;
    };
}

function EditEventForm({ event, onClose }: { event: EditEventButtonProps["event"]; onClose: () => void }) {
    const boundAction = updateEvent.bind(null, event.id);
    const [state, formAction, isPending] = useActionState(boundAction, null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Parse existing date into date and time parts for the inputs
    const existingDate = new Date(event.date);
    const dateStr = existingDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const timeStr = existingDate.toTimeString().slice(0, 5); // HH:MM

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 200 * 1024) {
                alert("File size too large. Max 200KB.");
                e.target.value = "";
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    if (state?.success) {
        return (
            <div className="flex flex-col items-center gap-4 py-8">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <p className="text-lg font-semibold">Event updated successfully!</p>
                <Button onClick={onClose}>Close</Button>
            </div>
        );
    }

    return (
        <form action={formAction} className="flex flex-col gap-0">
            <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
                {state?.error && typeof state.error === 'string' && (
                    <div className="flex items-start gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{state.error}</span>
                    </div>
                )}

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Basic Information</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-title">Event Name <span className="text-red-500">*</span></Label>
                            <Input id="edit-title" name="title" required defaultValue={event.title} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-category">Category <span className="text-red-500">*</span></Label>
                            <Input id="edit-category" name="category" required defaultValue={event.category} />
                        </div>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Schedule & Venue</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-date">Date <span className="text-red-500">*</span></Label>
                            <Input type="date" id="edit-date" name="date" required defaultValue={dateStr} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-time">Time <span className="text-red-500">*</span></Label>
                            <Input type="time" id="edit-time" name="time" required defaultValue={timeStr} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-capacity">Max Participants <span className="text-red-500">*</span></Label>
                            <Input type="number" id="edit-capacity" name="capacity" min="1" required defaultValue={event.capacity} />
                        </div>
                    </div>
                    <div className="mt-4 space-y-1.5">
                        <Label htmlFor="edit-location">Location <span className="text-red-500">*</span></Label>
                        <Input id="edit-location" name="location" required defaultValue={event.location} />
                    </div>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Event Image</p>
                    <div className="flex gap-4 items-start">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="edit-image-file" className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                <ImageIcon className="h-4 w-4" />
                                Choose File (Max 200KB)
                            </Label>
                            <Input id="edit-image-file" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            <Input type="hidden" name="image_base64" value={imagePreview || ""} />
                            <div className="space-y-1.5">
                                <p className="text-xs text-neutral-400">Or paste an image URL:</p>
                                <Input id="edit-image-url" name="image_url" placeholder="https://images.pexels.com/..." defaultValue={event.image_url || ""} />
                            </div>
                        </div>
                        {(imagePreview || event.image_url) && (
                            <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 shrink-0">
                                <Image src={imagePreview || event.image_url!} alt="Preview" fill className="object-cover" unoptimized />
                                {imagePreview && (
                                    <button type="button" onClick={() => setImagePreview(null)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80 transition-colors">
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Details</p>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-description">Description <span className="text-xs text-neutral-400 font-normal">(Markdown supported)</span></Label>
                            <Textarea id="edit-description" name="description" rows={4} className="resize-none" defaultValue={event.description || ""} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-rules">Rules <span className="text-xs text-neutral-400 font-normal">(Markdown supported)</span></Label>
                            <Textarea id="edit-rules" name="rules" rows={3} className="resize-none" defaultValue={event.rules || ""} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-deadline">Registration Deadline <span className="text-xs text-neutral-400 font-normal">(Optional)</span></Label>
                            <Input type="datetime-local" id="edit-deadline" name="registration_deadline"
                                defaultValue={event.registration_deadline ? new Date(event.registration_deadline).toISOString().slice(0, 16) : ""} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-end gap-3 rounded-b-lg">
                <p className="text-xs text-neutral-400 mr-auto">Fields marked <span className="text-red-500">*</span> are required</p>
                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isPending} className="min-w-28">
                    {isPending ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form>
    );
}

export function EditEventButton({ event }: EditEventButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                    <Pencil className="h-4 w-4" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0">
                <DialogHeader className="px-6 pt-6 pb-0">
                    <DialogTitle>Edit Event: {event.title}</DialogTitle>
                </DialogHeader>
                <EditEventForm event={event} onClose={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}

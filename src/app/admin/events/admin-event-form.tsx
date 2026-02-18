"use client";

import { useActionState } from "react";
import { createEvent } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, ImageIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useState, ChangeEvent } from "react";

export function AdminEventForm({ onSuccess }: { onSuccess?: () => void }) {
    const [state, formAction, isPending] = useActionState(createEvent, null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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

    return (
        <form action={formAction} className="flex flex-col gap-0">
            <div className="p-6 space-y-6 overflow-y-auto">

                {/* Status Messages */}
                {state?.error && typeof state.error === 'string' && (
                    <div className="flex items-start gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{state.error}</span>
                    </div>
                )}
                {state?.success && (
                    <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Event created successfully!</span>
                    </div>
                )}

                {/* Section: Basic Info */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Basic Information</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="title">Event Name <span className="text-red-500">*</span></Label>
                            <Input id="title" name="title" required placeholder="e.g. Tech Symposium 2026" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                            <Input id="category" name="category" required placeholder="e.g. Workshop, Seminar, Fest" />
                            <p className="text-xs text-neutral-400">New categories create a new filter automatically.</p>
                        </div>
                    </div>
                </div>

                {/* Section: Schedule */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Schedule & Venue</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="date">Date <span className="text-red-500">*</span></Label>
                            <Input type="date" id="date" name="date" required />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="time">Time <span className="text-red-500">*</span></Label>
                            <Input type="time" id="time" name="time" required />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="capacity">Max Participants <span className="text-red-500">*</span></Label>
                            <Input type="number" id="capacity" name="capacity" min="1" required defaultValue="50" />
                        </div>
                    </div>
                    <div className="mt-4 space-y-1.5">
                        <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                        <Input id="location" name="location" required placeholder="e.g. Auditorium A, Room 204" />
                    </div>
                </div>

                {/* Section: Image */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Event Image</p>
                    <div className="flex gap-4 items-start">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="image_file" className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                <ImageIcon className="h-4 w-4" />
                                Choose File (Max 200KB)
                            </Label>
                            <Input
                                id="image_file"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            <Input type="hidden" name="image_base64" value={imagePreview || ""} />
                            <div className="space-y-1.5">
                                <p className="text-xs text-neutral-400">Or paste an image URL:</p>
                                <Input
                                    id="image_url"
                                    name="image_url"
                                    placeholder="https://images.pexels.com/..."
                                />
                            </div>
                        </div>
                        {imagePreview && (
                            <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 shrink-0">
                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImagePreview(null)}
                                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80 transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section: Details */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">Details</p>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="description">Event Description <span className="text-xs text-neutral-400 font-normal">(Markdown supported)</span></Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe the event... Use **bold** or *italics*."
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="rules">Event Rules <span className="text-xs text-neutral-400 font-normal">(Markdown supported)</span></Label>
                            <Textarea
                                id="rules"
                                name="rules"
                                placeholder={"- Rule 1\n- Rule 2"}
                                rows={3}
                                className="resize-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="registration_deadline">Registration Deadline <span className="text-xs text-neutral-400 font-normal">(Optional)</span></Label>
                            <Input type="datetime-local" id="registration_deadline" name="registration_deadline" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-end gap-3 rounded-b-lg">
                <p className="text-xs text-neutral-400 mr-auto">Fields marked <span className="text-red-500">*</span> are required</p>
                <Button type="submit" disabled={isPending} className="min-w-32">
                    {isPending ? "Creating..." : "Create Event"}
                </Button>
            </div>
        </form>
    );
}

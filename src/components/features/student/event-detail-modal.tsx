"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Clock, BookOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { registerForEvent } from "@/app/(student)/feed/actions";
import ReactMarkdown from "react-markdown";

interface EventDetailModalProps {
    children: React.ReactNode;
    event: {
        id: string;
        title: string;
        date: string;
        time: string;
        location: string;
        category: string;
        description: string;
        registered: number;
        capacity: number;
        organizer: string;
        image: string;
        rules?: string;
        registration_deadline?: string;
        isPast?: boolean;
        isAlreadyRegistered?: boolean;
    };
    onRegisterSuccess?: () => void;
}

export function EventDetailModal({ children, event, onRegisterSuccess }: EventDetailModalProps) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(event.isAlreadyRegistered || false);
    const percentage = Math.round((event.registered / event.capacity) * 100);
    const isFull = event.registered >= event.capacity;
    const isPast = event.isPast || false;

    const router = useRouter();

    async function handleRegister() {
        if (isRegistered || isPast) return;

        setIsRegistering(true);
        try {
            const res = await registerForEvent(event.id);

            if (!res.error) {
                setIsRegistered(true);
                if (onRegisterSuccess) onRegisterSuccess();
            } else if (res.error === 'User not authenticated') {
                router.push('/login');
            } else {
                alert(res.error);
            }
        } catch (error) {
            console.error("Registration failed", error);
            alert("Something went wrong");
        } finally {
            setIsRegistering(false);
        }
    }

    const canRegister = !isFull && !isRegistered && !isPast;

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden gap-0 max-h-[90vh] flex flex-col">
                {/* Banner Image */}
                <div className={cn("relative h-48 w-full bg-neutral-100 dark:bg-neutral-800 shrink-0", isPast && "grayscale")}>
                    {event.image && event.image !== "/placeholder" ? (
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                            unoptimized={event.image.startsWith("data:")}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600" />
                    )}
                    {isPast && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <span className="px-4 py-2 bg-black/60 text-white text-sm font-semibold rounded-full">
                                This event has ended
                            </span>
                        </div>
                    )}
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1">
                    <div className="p-6 grid gap-5">
                        <DialogHeader className="text-left space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-medium">
                                    {event.category}
                                </span>
                                <span className="text-sm text-neutral-500">by {event.organizer}</span>
                            </div>
                            <DialogTitle className="text-2xl font-bold font-heading">{event.title}</DialogTitle>
                            <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    {event.date}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    {event.time}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />
                                    {event.location}
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Description */}
                        {event.description && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm uppercase tracking-wider text-neutral-900 dark:text-white">About Event</h4>
                                <div className="prose prose-sm dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300">
                                    <ReactMarkdown>{event.description}</ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {/* Rules */}
                        {event.rules && (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Rules & Guidelines
                                </h4>
                                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg p-4">
                                    <div className="prose prose-sm dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300">
                                        <ReactMarkdown>{event.rules}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Registration Status */}
                        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 space-y-3 border border-neutral-100 dark:border-neutral-800">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Registration Status</span>
                                <span className={cn("text-sm font-bold",
                                    isPast ? "text-neutral-500" : isFull ? "text-red-600" : "text-green-600"
                                )}>
                                    {isPast ? "Closed" : isFull ? "Full" : "Open"}
                                </span>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs text-neutral-500">
                                    <span>{event.registered} people going</span>
                                    <span>{event.capacity} capacity</span>
                                </div>
                                <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-500",
                                            isPast ? "bg-neutral-400" : isFull ? "bg-red-500" : "bg-green-500"
                                        )}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shrink-0 flex items-center justify-between gap-4">
                    <div className="text-xs text-neutral-500">
                        {isPast
                            ? "This event has already taken place."
                            : isRegistered
                                ? "You are registered for this event."
                                : "* Registration closes 2 hours before event"}
                    </div>
                    <Button
                        className={cn(
                            "min-w-[160px]",
                            isRegistered && "bg-green-600 hover:bg-green-700 text-white",
                            isPast && "bg-neutral-300 text-neutral-600 cursor-not-allowed"
                        )}
                        size="lg"
                        disabled={!canRegister || isRegistering}
                        onClick={canRegister ? handleRegister : undefined}
                    >
                        {isPast
                            ? "Event Ended"
                            : isRegistered
                                ? "✓ Registered"
                                : isRegistering
                                    ? "Registering..."
                                    : isFull
                                        ? "Event Full"
                                        : "Complete Registration"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

"use client";

import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EventCardProps {
    title: string;
    date: string;
    time: string;
    location: string;
    category: string;
    image: string;
    registered: number;
    capacity: number;
    isPast?: boolean;
    isRegistered?: boolean;
    className?: string;
}

export function EventCard({
    title,
    date,
    time,
    location,
    category,
    image,
    registered,
    capacity,
    isPast = false,
    isRegistered = false,
    className,
}: EventCardProps) {
    const percentage = Math.round((registered / capacity) * 100);
    const isFull = registered >= capacity;

    return (
        <Card className={cn(
            "overflow-hidden flex flex-col h-full group transition-all hover:shadow-lg hover:-translate-y-1 duration-300",
            isPast && "opacity-60 grayscale",
            className
        )}>
            <div className="relative h-48 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <div className="absolute top-3 right-3 z-10">
                    <span className="px-2 py-1 text-xs font-semibold bg-white/90 dark:bg-black/90 rounded-md backdrop-blur-sm shadow-sm uppercase tracking-wider">
                        {category}
                    </span>
                </div>
                {isPast && (
                    <div className="absolute top-3 left-3 z-10">
                        <span className="px-2 py-1 text-xs font-semibold bg-neutral-800/80 text-white rounded-md backdrop-blur-sm">
                            Past Event
                        </span>
                    </div>
                )}
                {image && image !== "/placeholder" ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized={image.startsWith("data:")}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-amber-50 dark:from-indigo-900/30 dark:to-amber-900/30 flex items-center justify-center text-neutral-300">
                        <span className="sr-only">Event Image: {title}</span>
                    </div>
                )}
            </div>

            <CardHeader className="p-4 pb-2">
                <h3 className="font-heading text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{date} • {time}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="line-clamp-1">{location}</span>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2 grow">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                        <span className={cn(isFull ? "text-red-600" : "text-neutral-600 dark:text-neutral-300")}>
                            {isFull ? "Event Full" : `${registered} / ${capacity} Registered`}
                        </span>
                        <span className="text-neutral-400">{percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full rounded-full transition-all duration-500",
                                isFull ? "bg-red-500" : percentage > 80 ? "bg-amber-500" : "bg-primary"
                            )}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full pointer-events-none"
                    disabled={isFull || isPast}
                    variant={isPast ? "outline" : isFull ? "outline" : isRegistered ? "outline" : "default"}
                >
                    {isPast ? "Event Ended" : isRegistered ? "Registered ✓" : isFull ? "Event Full" : "Register Now"}
                    {!isFull && !isPast && !isRegistered && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
            </CardFooter>
        </Card>
    );
}

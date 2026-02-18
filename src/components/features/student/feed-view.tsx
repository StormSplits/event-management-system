"use client";

import { useState, useMemo } from "react";
import { EventCard } from "./event-card";
import { EventDetailModal } from "./event-detail-modal";
import { FilterBar } from "./filter-bar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    organizer: string;
    registered: number;
    capacity: number;
    image: string;
    rules?: string;
    registration_deadline?: string;
    isPast?: boolean;
}

interface FeedViewProps {
    initialEvents: Event[];
    pastEvents?: Event[];
    categories: string[];
    userRegisteredIds?: string[];
}

export function FeedView({ initialEvents, pastEvents = [], categories, userRegisteredIds = [] }: FeedViewProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Events");
    const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

    const currentEvents = activeTab === "upcoming" ? initialEvents : pastEvents;

    const filteredEvents = useMemo(() => {
        return currentEvents.filter((event) => {
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All Events" || event.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [currentEvents, searchQuery, selectedCategory]);

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 border-b border-neutral-200 dark:border-neutral-800">
                <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === "upcoming"
                            ? "border-primary text-primary"
                            : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                        }`}
                >
                    Upcoming
                    {initialEvents.length > 0 && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                            {initialEvents.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("past")}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === "past"
                            ? "border-primary text-primary"
                            : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                        }`}
                >
                    Past Events
                    {pastEvents.length > 0 && (
                        <span className="ml-2 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-500 px-1.5 py-0.5 rounded-full">
                            {pastEvents.length}
                        </span>
                    )}
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input
                        placeholder="Search events..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <FilterBar
                categories={["All Events", ...categories]}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEvents.map((event) => {
                    const isAlreadyRegistered = userRegisteredIds.includes(event.id);
                    const isPast = activeTab === "past";
                    return (
                        <EventDetailModal
                            key={event.id}
                            event={{
                                ...event,
                                image: event.image || "/placeholder",
                                isPast,
                                isAlreadyRegistered,
                            }}
                        >
                            <div className="cursor-pointer h-full">
                                <EventCard
                                    {...event}
                                    image={event.image || "/placeholder"}
                                    isPast={isPast}
                                    isRegistered={isAlreadyRegistered}
                                />
                            </div>
                        </EventDetailModal>
                    );
                })}
                {filteredEvents.length === 0 && (
                    <div className="col-span-full text-center py-20 text-neutral-500 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                        <p>
                            {activeTab === "past"
                                ? "No past events found."
                                : "No upcoming events found matching your criteria."}
                        </p>
                    </div>
                )}
            </div>

            {filteredEvents.length > 0 && (
                <div className="py-8 text-center">
                    <p className="text-sm text-neutral-400">Showing {filteredEvents.length} events</p>
                </div>
            )}
        </div>
    );
}

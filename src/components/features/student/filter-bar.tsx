"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


export function FilterBar({
    className,
    categories,
    selectedCategory,
    onSelectCategory
}: {
    className?: string;
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}) {
    return (
        <div className={cn("w-full overflow-x-auto pb-4 scrollbar-hide", className)}>
            <div className="flex gap-2">
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => onSelectCategory(category)}
                        className={cn(
                            "rounded-full whitespace-nowrap",
                            selectedCategory === category ? "bg-indigo-600 hover:bg-indigo-700" : "bg-white dark:bg-neutral-950"
                        )}
                    >
                        {category}
                    </Button>
                ))}
            </div>
        </div>
    );
}

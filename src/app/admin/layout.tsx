import { AdminSidebar } from "@/components/features/admin/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900">
            <AdminSidebar />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-neutral-200 bg-white dark:bg-neutral-950 dark:border-neutral-800 flex items-center px-4 z-50">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <AdminSidebar className="flex w-full h-full border-r-0" />
                    </SheetContent>
                </Sheet>
                <div className="ml-4 font-bold text-lg">Admin Portal</div>
            </div>

            <div className="flex-1 md:ml-64 pt-16 md:pt-0">
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

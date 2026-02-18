import { createClient } from "@/lib/supabase/server";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function AdminParticipantsPage() {
    const supabase = await createClient();

    const { data: registrations, error } = await supabase
        .from('registrations')
        .select(`
            id,
            created_at,
            event_id,
            events (title, date, category),
            profile:profiles (full_name, email, role)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching registrations", error);
    }

    const participants = (registrations || []).map((reg: any) => ({
        id: reg.id,
        name: reg.profile?.full_name || "N/A",
        email: reg.profile?.email || "N/A",
        eventTitle: reg.events?.title || "N/A",
        eventCategory: reg.events?.category || "",
        registeredAt: new Date(reg.created_at).toLocaleDateString(),
    }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-neutral-900 dark:text-white">
                    All Participants
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                    {participants.length} total registration{participants.length !== 1 ? "s" : ""} across all events.
                </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Registered At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {participants.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell className="font-medium">{p.name}</TableCell>
                                <TableCell>{p.email}</TableCell>
                                <TableCell>{p.eventTitle}</TableCell>
                                <TableCell>
                                    {p.eventCategory && (
                                        <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800">
                                            {p.eventCategory}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>{p.registeredAt}</TableCell>
                            </TableRow>
                        ))}
                        {participants.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-neutral-500">
                                    No registrations found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

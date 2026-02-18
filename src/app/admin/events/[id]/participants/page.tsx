import { createClient } from "@/lib/supabase/server";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExportButton } from "./export-button";

interface Props {
    params: Promise<{
        id: string;
    }>
}

export default async function ParticipantsPage({ params }: Props) {
    const supabase = await createClient();
    const { id } = await params;

    // Fetch event details
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

    if (eventError || !event) {
        return notFound();
    }

    // Fetch participants
    const { data: registrations, error: regError } = await supabase
        .from('registrations')
        .select(`
            created_at,
            profile:profiles (
                id,
                full_name,
                email,
                role
            )
        `)
        .eq('event_id', id)
        .order('created_at', { ascending: false });

    if (regError) {
        console.error("Error fetching participants", regError);
    }

    const participants = (registrations || []).map((reg: any) => ({
        id: reg.profile.id,
        name: reg.profile.full_name,
        email: reg.profile.email,
        registeredAt: new Date(reg.created_at).toLocaleString(),
        role: reg.profile.role,
        status: "Registered" // Default status as we don't track attendance yet
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/admin/events">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold font-heading">{event.title} - Participants</h1>
                    <p className="text-neutral-500 text-sm">
                        {participants.length} / {event.capacity} Registered
                    </p>
                </div>
                <div className="ml-auto">
                    <ExportButton data={participants} filename={`${event.title}-participants.csv`} />
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Registered At</TableHead>
                            <TableHead>User ID</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {participants.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell className="font-medium">{p.name || "N/A"}</TableCell>
                                <TableCell>{p.email}</TableCell>
                                <TableCell>{p.registeredAt}</TableCell>
                                <TableCell className="font-mono text-xs text-neutral-500">{p.id}</TableCell>
                                <TableCell className="text-right">
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                        {p.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                        {participants.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-neutral-500">
                                    No participants registered yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

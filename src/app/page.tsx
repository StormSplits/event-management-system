import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-neutral-900">
        <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 font-heading">
          Every Campus Event, <br />
          <span className="text-primary">Perfectly Managed.</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl mb-8">
          From creation to check-in — one platform that connects your college community.
          Streamline operations and boost student engagement.
        </p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Get Started
            </Button>
          </Link>
          <Link href="/feed">
            <Button variant="outline" size="lg">
              Browse Upcoming Events
            </Button>
          </Link>
        </div>
      </main>
      <footer className="py-6 text-center text-neutral-500 text-sm border-t border-neutral-100 dark:border-neutral-800">
        <p>© 2026 College Event Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-900">
            <div className="w-full max-w-[440px] animate-fade-in">
                {children}
            </div>
        </div>
    );
}

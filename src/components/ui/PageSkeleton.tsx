type PageSkeletonProps = {
    cards?: number;
    rows?: number;
    detail?: boolean;
};

export default function PageSkeleton({ cards = 4, rows = 5, detail = false }: PageSkeletonProps) {
    return (
        <div className="animate-pulse space-y-6" aria-label="Loading page">
            <div className="space-y-2">
                <div className="h-8 w-64 rounded bg-muted" />
                <div className="h-4 w-96 max-w-full rounded bg-muted" />
            </div>
            {detail ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2, 3, 4].map((item) => (
                        <div className="h-44 rounded-xl bg-muted" key={item} />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: cards }, (_, index) => <div className="h-32 rounded-xl bg-muted" key={index} />)}
                    </div>
                    <div className="h-80 rounded-xl bg-muted" />
                    <div className="h-64 rounded-xl bg-muted" />
                    <div className="space-y-3 rounded-xl bg-muted p-6">
                        {Array.from({ length: rows }, (_, index) => <div className="h-5 rounded bg-background/60" key={index} />)}
                    </div>
                </>
            )}
        </div>
    );
}
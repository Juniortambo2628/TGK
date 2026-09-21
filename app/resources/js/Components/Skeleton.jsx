export function Skeleton({ className = '', variant = 'rect', ...props }) {
    const base = 'animate-pulse bg-brand-charcoal/10 dark:bg-white/10';
    const variantCls = variant === 'circle' ? 'rounded-full' : 'rounded-xl';
    return (
        <div
            className={`${base} ${variantCls} ${className}`}
            aria-hidden="true"
            {...props}
        />
    );
}

export function StoryCardSkeleton() {
    return (
        <div className="h-full flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-brand-hairline">
            <Skeleton className="aspect-[4/3] w-full !rounded-none" />
            <div className="flex flex-1 flex-col p-6 lg:p-8 space-y-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-3/4" />
                <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="mt-auto pt-6 border-t border-brand-hairline flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-brand-hairline space-y-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    );
}

export default Skeleton;

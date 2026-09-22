export function Skeleton({ className = '', variant = 'rect', ...props }) {
    const base = 'animate-pulse bg-brand-hairline/60';
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
            <div className="flex flex-1 flex-col p-6 lg:p-8">
                <Skeleton className="h-3 w-12 rounded-full mb-3" />
                <Skeleton className="h-6 w-5/6 mb-2" />
                <Skeleton className="h-6 w-3/4 mb-4" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="mt-auto pt-6 border-t border-brand-hairline flex items-center justify-between">
                    <Skeleton className="h-3 w-20 rounded-full" />
                    <Skeleton className="h-3 w-12 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-brand-hairline">
            <Skeleton className="aspect-square w-full rounded-2xl mb-4" />
            <Skeleton className="h-6 w-3/4 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    );
}

export function ContentPageSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-brand-hairline space-y-4">
                        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 5 }) {
    return (
        <div className="rounded-xl bg-white shadow-card ring-1 ring-brand-hairline overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-hairline">
                <Skeleton className="h-5 w-32" />
            </div>
            <div className="divide-y divide-brand-hairline">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="px-6 py-4 flex items-center gap-4">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/3" />
                        <div className="ml-auto">
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function FormSkeleton() {
    return (
        <div className="rounded-xl bg-white shadow-card ring-1 ring-brand-hairline p-6 lg:p-8 space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
            ))}
            <div className="pt-4">
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
        </div>
    );
}

export function HeroSkeleton() {
    return (
        <div className="relative w-full h-[70vh] min-h-[500px] bg-brand-charcoal/5 overflow-hidden">
            <Skeleton className="absolute inset-0 !rounded-none" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 px-6 max-w-2xl">
                    <Skeleton className="h-4 w-24 mx-auto rounded-full" />
                    <Skeleton className="h-12 w-3/4 mx-auto" />
                    <Skeleton className="h-12 w-1/2 mx-auto" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                    <div className="flex gap-3 justify-center pt-4">
                        <Skeleton className="h-12 w-36 rounded-full" />
                        <Skeleton className="h-12 w-36 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Skeleton;

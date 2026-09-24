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
        <div className="rounded-3xl bg-white shadow-card ring-1 ring-brand-hairline overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full !rounded-none" />
            <div className="p-5 lg:p-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    );
}

export function StatSkeleton() {
    return (
        <div className="border-t border-brand-hairline pt-6 space-y-3">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-3 w-40 rounded-full" />
        </div>
    );
}

export function ProgramStageCardSkeleton() {
    return (
        <div className="rounded-3xl bg-white p-8 lg:p-10 shadow-card ring-1 ring-brand-hairline space-y-4">
            <div className="flex items-center gap-3 mb-2">
                <Skeleton variant="circle" className="h-10 w-10" />
                <Skeleton className="h-3 w-16 rounded-full" />
            </div>
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-1/2 rounded-full" />
            <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    );
}

export function PartnerLogoGridSkeleton() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-10 items-center">
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="p-4 flex justify-center">
                    <Skeleton className="h-14 lg:h-16 w-24 lg:w-28 rounded-lg" />
                </div>
            ))}
        </div>
    );
}

export function CTABlockSkeleton({ tone = 'charcoal' }) {
    return (
        <section className={`${tone === 'red' ? 'bg-brand-red' : 'bg-brand-charcoal'} py-16 lg:py-24`}>
            <div className="container-page">
                <div className="max-w-3xl space-y-4">
                    <Skeleton className={`h-3 w-24 rounded-full ${tone === 'red' ? 'bg-white/25' : 'bg-white/15'}`} />
                    <Skeleton className={`h-10 w-4/5 rounded-lg ${tone === 'red' ? 'bg-white/25' : 'bg-white/15'}`} />
                    <Skeleton className={`h-5 w-3/5 rounded-full ${tone === 'red' ? 'bg-white/20' : 'bg-white/10'}`} />
                    <div className="flex gap-4 pt-4">
                        <Skeleton className={`h-12 w-36 rounded-full ${tone === 'red' ? 'bg-white/25' : 'bg-white/15'}`} />
                        <Skeleton className={`h-12 w-32 rounded-full ${tone === 'red' ? 'bg-white/20' : 'bg-white/10'}`} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export function HeroSkeleton({ minHeight = 'min-h-[60vh]' }) {
    return (
        <section className={`relative isolate flex items-center overflow-hidden ${minHeight} bg-brand-charcoal`}>
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-red/40 via-brand-charcoal/70 to-brand-off" />
            <div className="container-page py-24 text-center w-full">
                <div className="max-w-4xl mx-auto space-y-5">
                    <Skeleton className="h-9 w-40 mx-auto rounded-full bg-white/20" />
                    <Skeleton className="h-14 w-3/4 mx-auto rounded-lg bg-white/25" />
                    <Skeleton className="h-14 w-1/2 mx-auto rounded-lg bg-white/20" />
                    <Skeleton className="h-5 w-2/3 mx-auto rounded-full bg-white/15" />
                    <div className="flex gap-4 justify-center pt-4">
                        <Skeleton className="h-12 w-36 rounded-full bg-white/25" />
                        <Skeleton className="h-12 w-32 rounded-full bg-white/15" />
                    </div>
                </div>
            </div>
        </section>
    );
}

export function SectionHeaderSkeleton({ centered = false }) {
    return (
        <div className={`space-y-4 ${centered ? 'max-w-3xl mx-auto text-center' : 'max-w-3xl'}`}>
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-9 w-2/3 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-full" />
        </div>
    );
}

export function StoryIndexSkeleton() {
    return (
        <>
            <HeroSkeleton minHeight="min-h-[60vh]" />
            <div className="py-16 lg:py-20">
                <div className="container-page">
                    <div className="grid gap-10 lg:grid-cols-12">
                        <aside className="hidden lg:block lg:col-span-3 space-y-6">
                            <Skeleton className="h-5 w-24 rounded-full" />
                            <div className="space-y-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-10 w-full rounded-xl" />
                                ))}
                            </div>
                            <Skeleton className="h-px w-full" />
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-4 w-full rounded-full" />
                                        <Skeleton className="h-3 w-20 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </aside>
                        <div className="lg:col-span-9">
                            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <StoryCardSkeleton key={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function StoryShowSkeleton() {
    return (
        <>
            <HeroSkeleton minHeight="min-h-[60vh] lg:min-h-[70vh]" />
            <div className="py-16 lg:py-24">
                <div className="max-w-3xl mx-auto space-y-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className={`h-5 rounded-full ${i % 4 === 3 ? 'w-2/3' : 'w-full'}`} />
                    ))}
                </div>
            </div>
            <div className="bg-brand-panel py-16 lg:py-24">
                <div className="container-page space-y-10">
                    <Skeleton className="h-8 w-48 rounded-lg" />
                    <div className="grid gap-8 md:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <StoryCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export function HomePageSkeleton() {
    return (
        <>
            <HeroSkeleton minHeight="min-h-[92vh] lg:min-h-screen" />
            {/* Who we are: 5/7 split + 2 cards */}
            <div className="py-20 lg:py-28">
                <div className="container-page space-y-16">
                    <div className="grid gap-12 lg:grid-cols-12">
                        <div className="lg:col-span-5"><SectionHeaderSkeleton /></div>
                        <div className="lg:col-span-7 space-y-4 lg:pt-12">
                            <Skeleton className="h-5 w-full rounded-full" />
                            <Skeleton className="h-5 w-full rounded-full" />
                            <Skeleton className="h-5 w-4/5 rounded-full" />
                        </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-3xl bg-brand-panel p-8 lg:p-10 space-y-4">
                            <Skeleton className="h-3 w-20 rounded-full" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                        <div className="rounded-3xl bg-brand-charcoal p-8 lg:p-10 space-y-4">
                            <Skeleton className="h-3 w-20 rounded-full bg-white/20" />
                            <Skeleton className="h-6 w-3/4 bg-white/25" />
                            <Skeleton className="h-4 w-full bg-white/15" />
                            <Skeleton className="h-4 w-2/3 bg-white/15" />
                        </div>
                    </div>
                </div>
            </div>
            {/* Impact stats */}
            <div className="bg-brand-off py-20 lg:py-28">
                <div className="container-page grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-4 space-y-4">
                        <Skeleton className="h-3 w-24 rounded-full" />
                        <Skeleton className="h-9 w-40 rounded-lg" />
                        <Skeleton className="h-4 w-full rounded-full" />
                    </div>
                    <div className="lg:col-span-8 grid sm:grid-cols-2 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => <StatSkeleton key={i} />)}
                    </div>
                </div>
            </div>
            {/* Model band */}
            <div className="bg-brand-charcoal py-20 lg:py-28">
                <div className="container-page space-y-12">
                    <div className="max-w-2xl mx-auto text-center space-y-4">
                        <Skeleton className="h-3 w-24 mx-auto rounded-full bg-white/15" />
                        <Skeleton className="h-10 w-3/4 mx-auto rounded-lg bg-white/25" />
                        <Skeleton className="h-4 w-2/3 mx-auto rounded-full bg-white/10" />
                    </div>
                    <div className="grid gap-6 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="rounded-3xl bg-white/10 p-8 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton variant="circle" className="h-10 w-10 bg-white/20" />
                                    <Skeleton className="h-3 w-16 rounded-full bg-white/15" />
                                </div>
                                <Skeleton className="h-7 w-3/4 bg-white/25" />
                                <Skeleton className="h-4 w-1/2 rounded-full bg-white/15" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Stories */}
            <div className="bg-brand-panel py-20 lg:py-28">
                <div className="container-page space-y-10">
                    <SectionHeaderSkeleton />
                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => <StoryCardSkeleton key={i} />)}
                    </div>
                </div>
            </div>
            <CTABlockSkeleton tone="charcoal" />
        </>
    );
}

export function ContentPageSkeleton() {
    return (
        <>
            <HeroSkeleton minHeight="min-h-[70vh]" />
            <div className="py-16 lg:py-24">
                <div className="container-page grid gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-5"><SectionHeaderSkeleton /></div>
                    <div className="lg:col-span-7 space-y-4 lg:pt-12">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className={`h-5 rounded-full ${i % 5 === 4 ? 'w-3/5' : 'w-full'}`} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-brand-panel py-16 lg:py-24">
                <div className="container-page grid gap-8 md:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="rounded-3xl bg-white p-10 shadow-card ring-1 ring-brand-hairline space-y-4">
                            <Skeleton className="h-3 w-20 rounded-full" />
                            <Skeleton className="h-7 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    ))}
                </div>
            </div>
            <CTABlockSkeleton tone="red" />
        </>
    );
}

export function TableSkeleton({ rows = 5 }) {
    return (
        <div className="rounded-xl bg-white shadow-soft border border-brand-hairline overflow-hidden">
            <div className="px-6 py-4 border-b border-brand-hairline flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
            <div className="divide-y divide-brand-hairline">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="px-4 py-3 flex items-center gap-4">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/5" />
                        <Skeleton className="h-4 w-1/6" />
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
        <div className="grid gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-8">
                <div className="rounded-xl bg-white shadow-soft border border-brand-hairline p-6 lg:p-8 space-y-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-4 space-y-6">
                <div className="rounded-xl bg-white shadow-soft border border-brand-hairline p-6 space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-32 w-full rounded-lg" />
                </div>
                <div className="rounded-xl bg-white shadow-soft border border-brand-hairline p-6 space-y-4">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export function AdminPageSkeleton({ variant = 'table' }) {
    return (
        <>
            {/* AdminHero band */}
            <div className="bg-brand-off border-b border-brand-hairline">
                <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-40 rounded-full" />
                        <Skeleton className="h-8 w-56 rounded-lg" />
                        <Skeleton className="h-4 w-72 rounded-full" />
                    </div>
                </div>
            </div>
            <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8 space-y-6">
                {/* Floating toolbar */}
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 flex-1 rounded-lg" />
                    <Skeleton className="h-10 w-28 rounded-lg" />
                    <Skeleton className="h-10 w-24 rounded-lg" />
                </div>
                {variant === 'table' ? (
                    <TableSkeleton rows={6} />
                ) : variant === 'form' ? (
                    <FormSkeleton />
                ) : (
                    <div className="rounded-xl bg-white shadow-soft border border-brand-hairline p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="rounded-xl border border-brand-hairline bg-brand-off p-4 space-y-2">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-3 w-full rounded-full" />
                                    <Skeleton className="h-3 w-1/2 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export function AdminContentEditorSkeleton() {
    return (
        <>
            <div className="bg-brand-off border-b border-brand-hairline">
                <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-48 rounded-full" />
                        <Skeleton className="h-8 w-64 rounded-lg" />
                        <Skeleton className="h-4 w-80 rounded-full" />
                    </div>
                </div>
            </div>
            <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8 space-y-6">
                <div className="rounded-xl bg-white shadow-soft border border-brand-hairline overflow-hidden">
                    <div className="border-b border-brand-hairline px-6 py-4 flex gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 w-20 rounded-full" />
                        ))}
                    </div>
                    <div className="p-6 lg:p-8 space-y-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                {i % 2 === 0 ? (
                                    <Skeleton className="h-10 w-full rounded-lg" />
                                ) : (
                                    <Skeleton className="h-28 w-full rounded-lg" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Sticky save bar */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] lg:pl-[260px]">
                <div className="mx-auto max-w-5xl">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-brand-hairline shadow-lg">
                        <div className="flex items-center justify-end px-4 py-3">
                            <Skeleton className="h-10 w-32 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function PublicPageSkeleton({ page = 'default' }) {
    if (page === 'home') return <HomePageSkeleton />;
    if (page === 'stories') return <StoryIndexSkeleton />;
    if (page === 'story') return <StoryShowSkeleton />;
    if (page === 'partners') {
        return (
            <>
                <HeroSkeleton minHeight="min-h-[60vh]" />
                <div className="py-16 lg:py-24 container-page space-y-16">
                    <SectionHeaderSkeleton centered />
                    <PartnerLogoGridSkeleton />
                </div>
            </>
        );
    }
    if (page === 'get-involved') {
        return (
            <>
                <HeroSkeleton minHeight="min-h-[60vh]" />
                <div className="py-16 lg:py-24 container-page">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-3xl p-8 lg:p-10 space-y-4 ring-1 ${
                                    i === 2 ? 'bg-brand-charcoal ring-transparent' :
                                    i === 3 ? 'bg-brand-red ring-transparent' :
                                    'bg-white shadow-card ring-brand-hairline'
                                }`}
                            >
                                <Skeleton className={`h-3 w-20 rounded-full ${i >= 2 ? 'bg-white/20' : ''}`} />
                                <Skeleton className={`h-7 w-2/3 ${i >= 2 ? 'bg-white/25' : ''}`} />
                                <Skeleton className={`h-4 w-full ${i >= 2 ? 'bg-white/15' : ''}`} />
                                <Skeleton className={`h-4 w-3/4 ${i >= 2 ? 'bg-white/15' : ''}`} />
                                <Skeleton className={`h-10 w-28 rounded-full mt-4 ${i >= 2 ? 'bg-white/20' : ''}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }
    if (page === 'contact') {
        return (
            <>
                <HeroSkeleton minHeight="min-h-[55vh]" />
                <div className="py-16 lg:py-24 container-page grid gap-12 lg:grid-cols-12 items-start">
                    <div className="lg:col-span-5 space-y-6">
                        <SectionHeaderSkeleton />
                        <div className="space-y-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-3 w-20 rounded-full" />
                                    <Skeleton className="h-5 w-40 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-7">
                        <div className="rounded-3xl bg-white p-8 lg:p-10 shadow-card ring-1 ring-brand-hairline space-y-6">
                            <Skeleton className="h-7 w-40" />
                            <div className="grid sm:grid-cols-2 gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <Skeleton className="h-3 w-16 rounded-full" />
                                        <Skeleton className="h-11 w-full rounded-xl" />
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-20 rounded-full" />
                                <Skeleton className="h-32 w-full rounded-xl" />
                            </div>
                            <Skeleton className="h-12 w-32 rounded-full" />
                        </div>
                    </div>
                </div>
            </>
        );
    }
    // Generic content page (About, OurModel, Stawi, ReginaYego)
    return <ContentPageSkeleton />;
}

export default Skeleton;

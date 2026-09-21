import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

/**
 * Slim skeleton bar + top progress line for Inertia navigations.
 *
 * The default Inertia progress bar shows a spinner in the corner; that's
 * fine but doesn't feel like the site "knows something is loading". We
 * add:
 *
 *   1. A top progress line in brand red that fills as the request lands
 *   2. A subtle full-page skeleton overlay if the visit takes more than
 *      500ms (avoids flashing on fast navigations)
 *
 * Rendered once from SiteLayout; zero configuration at call sites.
 */
export default function NavigationProgress() {
    const [progress, setProgress] = useState(0);
    const [showSkeleton, setShowSkeleton] = useState(false);

    useEffect(() => {
        let progressTimer;
        let skeletonTimer;

        const startProgress = () => {
            setProgress(15);
            let p = 15;
            progressTimer = setInterval(() => {
                p = Math.min(90, p + Math.random() * 15);
                setProgress(p);
            }, 220);
            skeletonTimer = setTimeout(() => setShowSkeleton(true), 500);
        };

        const finishProgress = () => {
            clearInterval(progressTimer);
            clearTimeout(skeletonTimer);
            setProgress(100);
            setTimeout(() => { setProgress(0); setShowSkeleton(false); }, 250);
        };

        const offStart  = router.on('start',  startProgress);
        const offFinish = router.on('finish', finishProgress);
        // Also handle direct navigation errors so the bar doesn't stick
        const offError  = router.on('error',  finishProgress);

        return () => { offStart(); offFinish(); offError(); clearInterval(progressTimer); clearTimeout(skeletonTimer); };
    }, []);

    return (
        <>
            {/* Top progress line */}
            <div
                aria-hidden="true"
                className="fixed top-0 left-0 h-[3px] bg-brand-red z-[110] transition-all duration-200 ease-out"
                style={{ width: `${progress}%`, opacity: progress === 0 ? 0 : 1 }}
            />

            {/* Full-page skeleton overlay for slow navigations */}
            {showSkeleton && <PageSkeleton />}
        </>
    );
}

function PageSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 z-[105] bg-brand-off/85 backdrop-blur-sm animate-fade-in-up flex flex-col"
        >
            <div className="h-20" />
            <div className="container-page py-10 grid gap-8 lg:grid-cols-12 flex-1">
                <div className="lg:col-span-8 space-y-4">
                    <div className="h-8 w-1/3 rounded-full bg-brand-hairline" />
                    <div className="h-14 w-4/5 rounded-2xl bg-brand-hairline" />
                    <div className="h-14 w-3/5 rounded-2xl bg-brand-hairline" />
                    <div className="mt-8 grid grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-32 rounded-2xl bg-brand-hairline" />
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-4 space-y-4">
                    <div className="h-48 w-full rounded-3xl bg-brand-hairline" />
                    <div className="h-6 w-full rounded-full bg-brand-hairline" />
                    <div className="h-6 w-3/4 rounded-full bg-brand-hairline" />
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import {
    PublicPageSkeleton,
    AdminPageSkeleton,
    AdminContentEditorSkeleton,
    StoryIndexSkeleton,
} from './Skeleton';

/**
 * Slim skeleton bar + top progress line for Inertia navigations.
 *
 *   1. A top progress line in brand red that fills as the request lands
 *   2. A full-page skeleton overlay if the visit takes more than 500ms,
 *      shaped to match the destination layout (admin vs public).
 *
 * Rendered once from SiteLayout/AdminLayout; zero configuration at call sites.
 */
export default function NavigationProgress() {
    const [progress, setProgress] = useState(0);
    const [skeleton, setSkeleton] = useState(null); // null | { isAdmin, path }

    useEffect(() => {
        let progressTimer;
        let skeletonTimer;

        const startProgress = (event) => {
            setProgress(15);
            let p = 15;
            progressTimer = setInterval(() => {
                p = Math.min(90, p + Math.random() * 15);
                setProgress(p);
            }, 220);

            const visitUrl = event?.detail?.visit?.url || window.location.pathname;
            let path = visitUrl;
            try {
                path = new URL(visitUrl, window.location.origin).pathname;
            } catch { /* keep as-is */ }

            skeletonTimer = setTimeout(() => {
                setSkeleton({ isAdmin: path.startsWith('/admin'), path });
            }, 500);
        };

        const finishProgress = () => {
            clearInterval(progressTimer);
            clearTimeout(skeletonTimer);
            setProgress(100);
            setTimeout(() => { setProgress(0); setSkeleton(null); }, 250);
        };

        const offStart  = router.on('start',  startProgress);
        const offFinish = router.on('finish', finishProgress);
        const offError  = router.on('error',  finishProgress);

        return () => { offStart(); offFinish(); offError(); clearInterval(progressTimer); clearTimeout(skeletonTimer); };
    }, []);

    return (
        <>
            <div
                aria-hidden="true"
                className="fixed top-0 left-0 h-[3px] bg-brand-red z-[110] transition-all duration-200 ease-out"
                style={{ width: `${progress}%`, opacity: progress === 0 ? 0 : 1 }}
            />

            {skeleton && <PageSkeleton isAdmin={skeleton.isAdmin} path={skeleton.path} />}
        </>
    );
}

function PageSkeleton({ isAdmin, path }) {
    if (isAdmin) {
        if (path.startsWith('/admin/content/')) {
            return <Overlay><AdminContentEditorSkeleton /></Overlay>;
        }
        const isForm = /\/(create|edit)(\/|$)/.test(path);
        return (
            <Overlay>
                <AdminPageSkeleton variant={isForm ? 'form' : 'table'} />
            </Overlay>
        );
    }

    let page = 'default';
    if (path === '/' || path === '') page = 'home';
    else if (path.startsWith('/stories/')) page = 'story';
    else if (path.startsWith('/stories')) page = 'stories';
    else if (path.startsWith('/partners')) page = 'partners';
    else if (path.startsWith('/get-involved')) page = 'get-involved';
    else if (path.startsWith('/contact')) page = 'contact';
    else if (path.startsWith('/about')) page = 'default';
    else if (path.startsWith('/our-model')) page = 'default';
    else if (path.startsWith('/stawi')) page = 'default';
    else if (path.startsWith('/regina-yego')) page = 'default';

    if (page === 'stories') {
        return (
            <Overlay>
                <div className="pt-20 lg:pt-24">
                    <StoryIndexSkeleton />
                </div>
            </Overlay>
        );
    }

    return (
        <Overlay>
            <div className="pt-20 lg:pt-24">
                <PublicPageSkeleton page={page} />
            </div>
        </Overlay>
    );
}

function Overlay({ children }) {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 z-[105] bg-brand-off/90 backdrop-blur-sm animate-fade-in-up overflow-y-auto"
        >
            {children}
        </div>
    );
}

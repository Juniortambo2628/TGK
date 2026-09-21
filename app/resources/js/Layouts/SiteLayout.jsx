import { Head, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import NavigationProgress from '../Components/NavigationProgress';

/**
 * Global site chrome + a single Toaster instance. Whenever Inertia sends
 * a `flash.success` or `flash.error` (from any form submission, redirect
 * or Livewire action), the effect below promotes it to a react-hot-toast
 * pop-up so the user gets consistent, branded feedback instead of ugly
 * inline text or the browser alert dialog.
 *
 * We also surface Inertia's built-in `error` event as a toast so validation
 * failures from any page get the same treatment without per-form wiring.
 */
export default function SiteLayout({ children, title, description }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const seo = props.seo || {};
    const pageTitle = title || seo.title;
    const pageDesc = description || seo.description;

    useEffect(() => {
        if (flash.success) toast.success(flash.success, { duration: 4500 });
        if (flash.error)   toast.error(flash.error,   { duration: 5500 });
    }, [flash.success, flash.error]);

    useEffect(() => {
        // Surface validation / network errors from any Inertia form
        const off = router.on('error', (event) => {
            const errs = event.detail?.errors || {};
            const first = Object.values(errs)[0];
            if (first) toast.error(String(first));
        });
        // Expose a tiny helper for non-React handlers
        window.gkToast = toast;
        return () => { off(); delete window.gkToast; };
    }, []);

    return (
        <>
            {pageTitle && <Head title={pageTitle}>{pageDesc && <meta name="description" content={pageDesc} />}</Head>}
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-brand-red focus:text-white focus:px-4 focus:py-2 focus:rounded">
                Skip to content
            </a>
            <Nav />
            <main id="main" className="pt-20 lg:pt-24">{children}</main>
            <Footer />

            <Toaster
                position="top-right"
                gutter={8}
                toastOptions={{
                    duration: 4500,
                    style: {
                        borderRadius: '999px',
                        padding: '10px 16px',
                        background: '#353536',
                        color: '#FAFFFD',
                        fontFamily: 'Lato, system-ui, sans-serif',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        boxShadow: '0 12px 32px -12px rgba(53,53,54,0.35)',
                    },
                    success: {
                        iconTheme: { primary: '#FB2436', secondary: '#FAFFFD' },
                    },
                    error: {
                        style: { background: '#C4101F', color: '#FAFFFD' },
                        iconTheme: { primary: '#FAFFFD', secondary: '#C4101F' },
                    },
                }}
            />

            <NavigationProgress />
        </>
    );
}

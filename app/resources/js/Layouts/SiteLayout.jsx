import { Head, usePage } from '@inertiajs/react';
import GlobalToast from '../Components/Admin/GlobalToast';
import Nav from '../Components/Nav';
import Footer from '../Components/Footer';
import NavigationProgress from '../Components/NavigationProgress';

export default function SiteLayout({ children, title, description }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const seo = props.seo || {};
    const pageTitle = title || seo.title;
    const pageDesc = description || seo.description;

    return (
        <>
            {pageTitle && <Head title={pageTitle}>{pageDesc && <meta name="description" content={pageDesc} />}</Head>}
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-brand-red focus:text-white focus:px-4 focus:py-2 focus:rounded">
                Skip to content
            </a>
            <Nav />
            <main id="main" className="pt-20 lg:pt-24">{children}</main>
            <Footer />

            <NavigationProgress />
            <GlobalToast flash={flash} />
        </>
    );
}

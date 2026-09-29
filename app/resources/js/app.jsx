import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { route } from 'ziggy-js';

import SiteLayout from './Layouts/SiteLayout';
import AdminLayout from './Layouts/AdminLayout';

window.route = route;

const appName = import.meta.env.VITE_APP_NAME || 'Good Kenyan Foundation';

const pages = import.meta.glob('./Pages/**/*.jsx');

// Recover from failed chunk fetches. These happen on flaky networks/hosts
// (ERR_CONNECTION_RESET) and when a page is left open across a redeploy so the
// referenced hashed chunk no longer exists. Retry once, then fall back to a
// single guarded full reload (which pulls a fresh index + manifest) rather
// than leaving the navigation dead.
const RELOAD_GUARD = 'tgk:chunk-reloaded';

function reloadOnce() {
    try {
        if (!sessionStorage.getItem(RELOAD_GUARD)) {
            sessionStorage.setItem(RELOAD_GUARD, String(Date.now()));
            window.location.reload();
            return true;
        }
    } catch { /* sessionStorage unavailable — fall through */ }
    return false;
}

if (typeof window !== 'undefined') {
    window.addEventListener('vite:preloadError', (event) => {
        event.preventDefault();
        reloadOnce();
    });
}

async function resolvePage(name, tries = 1) {
    try {
        const page = await resolvePageComponent(`./Pages/${name}.jsx`, pages);
        try { sessionStorage.removeItem(RELOAD_GUARD); } catch { /* ignore */ }
        return page;
    } catch (error) {
        if (tries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 400));
            return resolvePage(name, tries - 1);
        }
        if (reloadOnce()) {
            // Reload is in flight; keep the promise pending so nothing renders.
            return new Promise(() => {});
        }
        throw error;
    }
}

createInertiaApp({
    title: (title) => title || appName,
    resolve: async (name) => {
        const page = await resolvePage(name);
        if (name.startsWith('Admin/')) {
            page.default.layout = page.default.layout || ((p) => <AdminLayout>{p}</AdminLayout>);
        } else {
            page.default.layout = page.default.layout || ((p) => <SiteLayout>{p}</SiteLayout>);
        }
        return page;
    },
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />);
            return;
        }
        if (el.hasChildNodes()) {
            hydrateRoot(el, <App {...props} />);
            return;
        }
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#FB2436',
        showSpinner: false,
    },
});

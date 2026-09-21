import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';

import SiteLayout from './Layouts/SiteLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Good Kenyan Foundation';

// Persistent layout shared across pages to prevent full unmount/remount on navigation
const defaultLayout = (page) => <SiteLayout>{page}</SiteLayout>;

createInertiaApp({
    title: (title) => (title ? `${title} · ${appName}` : appName),
    resolve: async (name) => {
        const page = await resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'));
        page.default.layout = page.default.layout || defaultLayout;
        return page;
    },
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
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

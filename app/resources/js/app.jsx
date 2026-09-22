import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { route } from 'ziggy-js';

import SiteLayout from './Layouts/SiteLayout';
import AdminLayout from './Layouts/AdminLayout';

window.route = route;

const appName = import.meta.env.VITE_APP_NAME || 'Good Kenyan Foundation';

createInertiaApp({
    title: (title) => (title ? `${title} · ${appName}` : appName),
    resolve: async (name) => {
        const page = await resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'));
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
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#FB2436',
        showSpinner: false,
    },
});

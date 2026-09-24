import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { route } from 'ziggy-js';
import { renderToString } from 'react-dom/server';

import SiteLayout from './Layouts/SiteLayout';
import AdminLayout from './Layouts/AdminLayout';

if (typeof window !== 'undefined') {
    window.route = route;
}

const appName = import.meta.env.VITE_APP_NAME || 'Good Kenyan Foundation';

createInertiaApp({
    title: (title) => title || appName,
    resolve: async (name) => {
        const page = await resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'));
        if (name.startsWith('Admin/')) {
            page.default.layout = page.default.layout || ((p) => <AdminLayout>{p}</AdminLayout>);
        } else {
            page.default.layout = page.default.layout || ((p) => <SiteLayout>{p}</SiteLayout>);
        }
        return page;
    },
    render: ({ App, props }) => renderToString(<App {...props} />),
});

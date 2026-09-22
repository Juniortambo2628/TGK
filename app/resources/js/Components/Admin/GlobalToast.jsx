import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';

const toastOptions = {
    position: 'top-right',
    gutter: 8,
    toastOptions: {
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
    },
};

export default function GlobalToast({ flash }) {
    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { duration: 4500 });
        if (flash?.error) toast.error(flash.error, { duration: 5500 });
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        const off = router.on('error', (event) => {
            const errs = event.detail?.errors || {};
            const first = Object.values(errs)[0];
            if (first) toast.error(String(first));
        });
        window.gkToast = toast;
        return () => { off(); delete window.gkToast; };
    }, []);

    return null;
}

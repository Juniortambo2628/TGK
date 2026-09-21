import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    red: '#FB2436',
                    'red-deep': '#C4101F',
                    'red-tint': '#FDD3D7',
                    charcoal: '#353536',
                    grey: '#6E6E70',
                    hairline: '#E4E2DD',
                    panel: '#F1EFEA',
                    off: '#FAFFFD',
                    green: '#77C92B',
                },
            },
            fontFamily: {
                sans: ['Lato', ...defaultTheme.fontFamily.sans],
                display: ['Lato', ...defaultTheme.fontFamily.sans],
            },
            fontWeight: {
                normal: '400',
                bold: '700',
                black: '900',
            },
            fontSize: {
                caption: ['0.625rem', { lineHeight: '1rem' }],
                body: ['0.875rem', { lineHeight: '1.5' }],
                subheading: ['1.125rem', { lineHeight: '1.4' }],
                heading: ['2.125rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
                display: ['3.375rem', { lineHeight: '1.05', letterSpacing: '-0.015em' }],
                'display-xl': ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
            },
            maxWidth: {
                container: '80rem',
            },
            boxShadow: {
                soft: '0 8px 30px -10px rgba(53,53,54,0.15)',
                card: '0 12px 40px -12px rgba(53,53,54,0.18)',
            },
            keyframes: {
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.6s ease-out both',
            },
        },
    },
    plugins: [forms, typography],
};

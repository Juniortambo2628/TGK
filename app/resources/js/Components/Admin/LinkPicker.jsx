import { useState } from 'react';

const routeGroups = [
    {
        label: 'Pages',
        routes: [
            { label: 'Home', path: '/' },
            { label: 'About', path: '/about' },
            { label: 'Our Model', path: '/our-model' },
            { label: 'Regina Yego', path: '/regina-yego' },
            { label: 'Stawi', path: '/stawi' },
            { label: 'Partners', path: '/partners' },
            { label: 'Get Involved', path: '/get-involved' },
            { label: 'Contact', path: '/contact' },
            { label: 'Stories', path: '/stories' },
        ],
    },
    {
        label: 'Actions',
        routes: [
            { label: 'Become a Mentor', path: '/get-involved#mentor' },
            { label: 'Give a Scholarship', path: '/get-involved#scholarship' },
            { label: 'Register', path: '/get-involved#register' },
        ],
    },
    {
        label: 'External',
        routes: [
            { label: 'Donate (M-Pesa)', path: 'https://paystack.com/pay/thegivingkids', external: true },
            { label: 'Donate (PayPal)', path: 'https://donate.thegivingkids.org', external: true },
        ],
    },
];

export default function LinkPicker({ value = '', onChange = () => {}, label = 'Link destination' }) {
    const [isCustom, setIsCustom] = useState(false);
    const [customUrl, setCustomUrl] = useState('');

    const handleChange = (e) => {
        const val = e.target.value;
        if (val === '__custom__') {
            setIsCustom(true);
            onChange(customUrl);
        } else {
            setIsCustom(false);
            onChange(val);
        }
    };

    const handleCustomChange = (e) => {
        const val = e.target.value;
        setCustomUrl(val);
        onChange(val);
    };

    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-bold text-brand-charcoal/60">{label}</label>
            <select
                value={isCustom ? '__custom__' : value}
                onChange={handleChange}
                className="w-full rounded-lg border border-brand-hairline bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
            >
                <option value="">Select a destination...</option>
                {routeGroups.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                        {group.routes.map((route) => (
                            <option key={route.path} value={route.path}>
                                {route.label} — {route.path}
                            </option>
                        ))}
                    </optgroup>
                ))}
                <option value="__custom__">Custom URL...</option>
            </select>
            {isCustom && (
                <input
                    type="url"
                    value={customUrl}
                    onChange={handleCustomChange}
                    placeholder="https://example.com/page"
                    className="w-full rounded-lg border border-brand-hairline bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors mt-2"
                />
            )}
            {!isCustom && value && (
                <p className="text-xs text-brand-charcoal/40 mt-1">
                    Will navigate to: <span className="font-medium text-brand-charcoal/60">{value}</span>
                </p>
            )}
        </div>
    );
}

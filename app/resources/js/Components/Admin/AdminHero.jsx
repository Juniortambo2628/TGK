import { Link } from '@inertiajs/react';

const icons = {
    plus: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    ),
    download: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
    ),
};

export default function AdminHero({ title, description, breadcrumbs = [], actions = [] }) {
    return (
        <div className="bg-brand-off border-b border-brand-hairline">
            <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        {breadcrumbs.length > 0 && (
                            <nav className="flex items-center gap-1.5 mb-2">
                                {breadcrumbs.map((crumb, i) => (
                                    <span key={i} className="flex items-center gap-1.5">
                                        {i > 0 && <span className="text-brand-charcoal/30">/</span>}
                                        {crumb.href ? (
                                            <Link
                                                href={crumb.href}
                                                className="text-xs text-brand-charcoal/50 hover:text-brand-red transition-colors"
                                            >
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span className="text-xs text-brand-charcoal/50">{crumb.label}</span>
                                        )}
                                    </span>
                                ))}
                            </nav>
                        )}
                        <h1 className="text-2xl font-black text-brand-charcoal">{title}</h1>
                        {description && (
                            <p className="text-sm text-brand-charcoal/60 mt-1">{description}</p>
                        )}
                    </div>

                    {actions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            {actions.map((action, i) => (
                                <Link
                                    key={i}
                                    href={action.href}
                                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                                        i === 0
                                            ? 'bg-brand-red text-white hover:bg-brand-red-deep'
                                            : 'bg-white text-brand-charcoal border border-brand-hairline hover:bg-brand-panel'
                                    }`}
                                >
                                    {action.icon && icons[action.icon]}
                                    {action.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

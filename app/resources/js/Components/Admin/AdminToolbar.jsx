import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import ViewToggle from './ViewToggle';
import { IconSearch, IconTrash, IconDownload, IconPlus, IconChevronDown, IconChevronUp } from './Icons';

const bulkIcons = { trash: IconTrash, download: IconDownload };
const actionIcons = { plus: IconPlus, download: IconDownload };
const STORAGE_KEY = 'tgk-admin-toolbar-hidden';

export default function AdminToolbar({
    search = { value: '', onChange: () => {}, placeholder: 'Search...' },
    filters = [],
    activeFilter = 'all',
    onFilterChange = () => {},
    viewMode = 'list',
    onViewModeChange = () => {},
    bulkActions = null,
    actions = null,
    selectedCount = 0,
    onSelectAll = () => {},
    onDeselectAll = () => {},
    children,
}) {
    const hasBulkActions = bulkActions && bulkActions.length > 0;
    const hasActions = actions && actions.length > 0;
    const [hidden, setHidden] = useState(() => {
        if (typeof window === 'undefined') return false;
        try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            if (hidden) localStorage.setItem(STORAGE_KEY, '1');
            else localStorage.removeItem(STORAGE_KEY);
        } catch { /* ignore */ }
    }, [hidden]);

    const shell = 'bg-white/70 backdrop-blur-xl rounded-xl border border-white/50 shadow-soft';

    if (hidden) {
        return (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] lg:pl-[260px] pointer-events-none">
                <div className="mx-auto max-w-5xl flex justify-end pr-1">
                    <button
                        type="button"
                        onClick={() => setHidden(false)}
                        title="Show toolbar"
                        aria-label="Show toolbar"
                        className={`pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-charcoal/70 hover:text-brand-red transition-colors ${shell}`}
                    >
                        <IconChevronUp className="w-3.5 h-3.5" />
                        Toolbar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] lg:pl-[260px]">
            <div className="mx-auto max-w-5xl">
                <div className={shell}>
                    <div className="flex items-center gap-2 px-2.5 py-2">
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {hasBulkActions && (
                                <label className="flex items-center gap-1.5 text-xs text-brand-charcoal/60 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        className="rounded border-brand-hairline text-brand-red focus:ring-brand-red"
                                        checked={selectedCount > 0}
                                        onChange={(e) => e.target.checked ? onSelectAll() : onDeselectAll()}
                                    />
                                    {selectedCount > 0 && (
                                        <span className="inline-flex items-center rounded-full bg-brand-red/10 text-brand-red px-1.5 py-0.5 text-[11px] font-bold">
                                            {selectedCount}
                                        </span>
                                    )}
                                </label>
                            )}

                            {filters.length > 0 && (
                                <select
                                    value={activeFilter}
                                    onChange={(e) => onFilterChange(e.target.value)}
                                    className="rounded-lg border border-white/60 bg-white/80 px-2 py-1.5 text-xs text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors cursor-pointer"
                                >
                                    {filters.map((f) => (
                                        <option key={f.key} value={f.key}>{f.label}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="relative flex-1 min-w-0">
                            <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
                                <IconSearch className="w-3.5 h-3.5 text-brand-charcoal/40" />
                            </div>
                            <input
                                type="text"
                                value={search.value}
                                onChange={(e) => search.onChange(e.target.value)}
                                placeholder={search.placeholder}
                                className="w-full rounded-lg border border-white/60 bg-white/80 pl-8 pr-2.5 py-1.5 text-xs text-brand-charcoal placeholder-brand-charcoal/40 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                            <ViewToggle mode={viewMode} onChange={onViewModeChange} />

                            {bulkActions && selectedCount > 0 && bulkActions.map((action, i) => {
                                const Icon = bulkIcons[action.icon];
                                return (
                                    <button
                                        key={i}
                                        onClick={action.onClick}
                                        className={`inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold transition-colors ${
                                            action.danger
                                                ? 'bg-brand-red text-white hover:bg-brand-red-deep'
                                                : 'bg-white/70 text-brand-charcoal hover:bg-white'
                                        }`}
                                    >
                                        {Icon && <Icon className="w-3.5 h-3.5" />}
                                        {action.label}
                                    </button>
                                );
                            })}

                            {children}

                            {hasActions && actions.map((action, i) => {
                                const Icon = actionIcons[action.icon];
                                const className = `inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold transition-colors ${
                                    action.primary
                                        ? 'bg-brand-red text-white hover:bg-brand-red-deep'
                                        : 'bg-white/70 text-brand-charcoal hover:bg-white'
                                }`;
                                const content = (
                                    <>
                                        {Icon && <Icon className="w-3.5 h-3.5" />}
                                        {action.label}
                                    </>
                                );
                                return action.href ? (
                                    <Link key={`a-${i}`} href={action.href} className={className}>
                                        {content}
                                    </Link>
                                ) : (
                                    <button key={`a-${i}`} type="button" onClick={action.onClick} className={className}>
                                        {content}
                                    </button>
                                );
                            })}

                            <button
                                type="button"
                                onClick={() => setHidden(true)}
                                title="Hide toolbar"
                                aria-label="Hide toolbar"
                                className="inline-flex items-center justify-center rounded-lg p-1.5 text-brand-charcoal/50 hover:text-brand-red hover:bg-white/70 transition-colors"
                            >
                                <IconChevronDown className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { Link } from '@inertiajs/react';
import ViewToggle from './ViewToggle';
import { IconSearch, IconTrash, IconDownload, IconPlus } from './Icons';

const bulkIcons = { trash: IconTrash, download: IconDownload };
const actionIcons = { plus: IconPlus, download: IconDownload };

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

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] lg:pl-[260px]">
            <div className="mx-auto max-w-5xl">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-brand-hairline shadow-lg">
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {hasBulkActions && (
                            <label className="flex items-center gap-2 text-xs text-brand-charcoal/60 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="rounded border-brand-hairline text-brand-red focus:ring-brand-red"
                                    checked={selectedCount > 0}
                                    onChange={(e) => e.target.checked ? onSelectAll() : onDeselectAll()}
                                />
                                {selectedCount > 0 && (
                                    <span className="inline-flex items-center rounded-full bg-brand-red/10 text-brand-red px-2 py-0.5 text-xs font-bold">
                                        {selectedCount}
                                    </span>
                                )}
                            </label>
                        )}

                        {filters.length > 0 && (
                            <select
                                value={activeFilter}
                                onChange={(e) => onFilterChange(e.target.value)}
                                className="rounded-lg border border-brand-hairline bg-white px-3 py-2 text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors cursor-pointer"
                            >
                                {filters.map((f) => (
                                    <option key={f.key} value={f.key}>{f.label}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="relative flex-1 min-w-0">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <IconSearch className="w-4 h-4 text-brand-charcoal/40" />
                        </div>
                        <input
                            type="text"
                            value={search.value}
                            onChange={(e) => search.onChange(e.target.value)}
                            placeholder={search.placeholder}
                            className="w-full rounded-lg border border-brand-hairline bg-white pl-9 pr-3 py-2 text-sm text-brand-charcoal placeholder-brand-charcoal/40 focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <ViewToggle mode={viewMode} onChange={onViewModeChange} />

                        {bulkActions && selectedCount > 0 && bulkActions.map((action, i) => {
                            const Icon = bulkIcons[action.icon];
                            return (
                                <button
                                    key={i}
                                    onClick={action.onClick}
                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                                        action.danger
                                            ? 'bg-brand-red text-white hover:bg-brand-red-deep'
                                            : 'bg-brand-panel text-brand-charcoal hover:bg-brand-hairline'
                                    }`}
                                >
                                    {Icon && <Icon />}
                                    {action.label}
                                </button>
                            );
                        })}

                        {children}

                        {hasActions && actions.map((action, i) => {
                            const Icon = actionIcons[action.icon];
                            const className = `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                                action.primary
                                    ? 'bg-brand-red text-white hover:bg-brand-red-deep'
                                    : 'bg-brand-panel text-brand-charcoal hover:bg-brand-hairline'
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
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AdminHero from '../../../Components/Admin/AdminHero';
import AdminToolbar from '../../../Components/Admin/AdminToolbar';
import AdminCard from '../../../Components/Admin/AdminCard';
import StatusBadge from '../../../Components/Admin/StatusBadge';
import { useSelectableList } from '../../../hooks/useSelectableList';

export default function Index({ partners = [] }) {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list');

    const filters = [
        { key: 'all', label: 'All' },
        { key: 'active', label: 'Active' },
        { key: 'inactive', label: 'Inactive' },
    ];

    const filteredPartners = partners.filter((partner) => {
        const matchesSearch = !search || partner.name?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            activeFilter === 'all' ||
            (activeFilter === 'active' && partner.is_active) ||
            (activeFilter === 'inactive' && !partner.is_active);
        return matchesSearch && matchesFilter;
    });

    const handleDelete = (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
        router.delete(route('admin.partners.destroy', id), {
            onSuccess: () => toast.success('Partner deleted.'),
        });
    };

    const { selectedIds, toggleSelect, toggleSelectAll, handleBulkDelete, clearSelection, selectAllProps, selectedCount } =
        useSelectableList(filteredPartners, { routeName: 'admin.partners.destroy', confirmMessage: 'items' });

    return (
        <>
            <Head title="Partners" />

            <AdminHero
                title="Partners"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'People', href: '/admin/partners' },
                    { label: 'Partners' },
                ]}
                actions={[{ label: 'New Partner', href: route('admin.partners.create'), icon: 'plus' }]}
            />

            <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8 space-y-6">
                <AdminToolbar
                    search={{ value: search, onChange: setSearch, placeholder: 'Search partners...' }}
                    filters={filters}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    bulkActions={[
                        { label: 'Delete', icon: 'trash', onClick: handleBulkDelete, danger: true },
                    ]}
                    selectedCount={selectedCount}
                    onSelectAll={toggleSelectAll}
                    onDeselectAll={clearSelection}
                />

                <AdminCard>
                    {viewMode === 'list' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-brand-hairline bg-brand-panel/60">
                                        <th className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                className="rounded border-brand-hairline text-brand-red focus:ring-brand-red"
                                                checked={selectAllProps.checked}
                                                onChange={selectAllProps.onChange}
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Logo</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Name</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">URL</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Active</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Sort</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-hairline">
                                    {filteredPartners.map((row) => (
                                        <tr key={row.id} className="transition-colors hover:bg-brand-panel/40">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-brand-hairline text-brand-red focus:ring-brand-red"
                                                    checked={selectedIds.includes(row.id)}
                                                    onChange={() => toggleSelect(row.id)}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                {row.logo_url ? (
                                                    <img src={row.logo_url} alt="" className="h-8 w-auto rounded bg-brand-panel object-contain" />
                                                ) : (
                                                    <span className="text-brand-charcoal/30">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-brand-charcoal">{row.name}</td>
                                            <td className="px-4 py-3">
                                                {row.url ? (
                                                    <a href={row.url} target="_blank" rel="noopener noreferrer" className="text-brand-charcoal/50 hover:text-brand-red transition-colors underline underline-offset-2 decoration-brand-hairline">
                                                        {row.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                                    </a>
                                                ) : (
                                                    '—'
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={row.is_active ? 'active' : 'inactive'} />
                                            </td>
                                            <td className="px-4 py-3 text-brand-charcoal/50 tabular-nums">{row.sort_order}</td>
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-3">
                                                    <Link
                                                        href={route('admin.partners.edit', row.id)}
                                                        className="text-sm font-bold text-brand-charcoal/60 hover:text-brand-red transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(row.id, row.name)}
                                                        className="text-sm font-bold text-brand-charcoal/60 hover:text-brand-red transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPartners.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-sm text-brand-charcoal/40">
                                                No partners found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredPartners.map((partner) => (
                                <div key={partner.id} className="rounded-xl border border-brand-hairline bg-brand-off p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        {partner.logo_url ? (
                                            <img src={partner.logo_url} alt={partner.name} className="h-10 w-auto rounded bg-brand-panel object-contain" />
                                        ) : (
                                            <div className="h-10 w-10 rounded bg-brand-panel flex items-center justify-center text-brand-charcoal/30 text-xs font-bold">
                                                {partner.name?.charAt(0)}
                                            </div>
                                        )}
                                        <input
                                            type="checkbox"
                                            className="rounded border-brand-hairline text-brand-red focus:ring-brand-red flex-shrink-0"
                                            checked={selectedIds.includes(partner.id)}
                                            onChange={() => toggleSelect(partner.id)}
                                        />
                                    </div>
                                    <p className="font-bold text-brand-charcoal">{partner.name}</p>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={partner.is_active ? 'active' : 'inactive'} />
                                        <span className="text-xs text-brand-charcoal/40">Sort: {partner.sort_order}</span>
                                    </div>
                                    <div className="flex items-center gap-3 pt-1">
                                        <Link
                                            href={route('admin.partners.edit', partner.id)}
                                            className="text-xs font-bold text-brand-red hover:text-brand-red-deep transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(partner.id, partner.name)}
                                            className="text-xs font-bold text-brand-charcoal/50 hover:text-brand-red transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredPartners.length === 0 && (
                                <p className="col-span-full text-center text-sm text-brand-charcoal/40 py-8">No partners found.</p>
                            )}
                        </div>
                    )}
                </AdminCard>
            </div>
        </>
    );
}

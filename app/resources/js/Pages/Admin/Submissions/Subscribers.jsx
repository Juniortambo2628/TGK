import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { exportCSV } from '../../../lib/csv';
import { useSelectableList } from '../../../hooks/useSelectableList';
import AdminHero from '../../../Components/Admin/AdminHero';
import AdminToolbar from '../../../Components/Admin/AdminToolbar';
import AdminCard from '../../../Components/Admin/AdminCard';
import SubmissionDetailDialog from '../../../Components/Admin/SubmissionDetailDialog';

export default function Subscribers({ subscribers = [] }) {
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('list');

    const filteredSubscribers = subscribers.filter((sub) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return sub.email?.toLowerCase().includes(q);
    });

    const { selectedIds, toggleSelect, toggleSelectAll, handleBulkDelete, clearSelection } = useSelectableList(filteredSubscribers, { routeName: 'admin.subscribers.destroy', confirmMessage: 'subscribers' });

    const handleDelete = (id, email) => {
        if (confirm(`Are you sure you want to remove subscriber "${email}"?`)) {
            router.delete(route('admin.subscribers.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Subscriber removed.');
                    setSelected(null);
                },
            });
        }
    };



    const handleExport = () => {
        exportCSV(filteredSubscribers, 'subscribers.csv');
    };

    return (
        <>
            <Head title="Subscribers" />

            <AdminHero
                title="Subscribers"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Submissions' },
                    { label: 'Subscribers' },
                ]}
            />

            <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8 space-y-6">
                <AdminToolbar
                    search={{ value: search, onChange: setSearch, placeholder: 'Search subscribers...' }}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    bulkActions={[
                        { label: 'Delete', icon: 'trash', onClick: handleBulkDelete, danger: true },
                        { label: 'Export', icon: 'download', onClick: handleExport },
                    ]}
                    selectedCount={selectedIds.length}
                    onSelectAll={toggleSelectAll}
                    onDeselectAll={clearSelection}
                    actions={[
                        { label: 'Export', icon: 'download', onClick: handleExport },
                    ]}
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
                                                checked={selectedIds.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Email</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">IP</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Signed Up</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-hairline">
                                    {filteredSubscribers.map((row) => (
                                        <tr key={row.id} className="transition-colors hover:bg-brand-panel/40">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-brand-hairline text-brand-red focus:ring-brand-red"
                                                    checked={selectedIds.includes(row.id)}
                                                    onChange={() => toggleSelect(row.id)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-bold text-brand-charcoal">{row.email}</td>
                                            <td className="px-4 py-3 text-brand-charcoal/50 font-mono text-xs">{row.ip}</td>
                                            <td className="px-4 py-3 text-xs text-brand-charcoal/50">
                                                {row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelected(row)}
                                                    className="text-sm font-bold text-brand-charcoal/60 hover:text-brand-red transition-colors"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredSubscribers.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-brand-charcoal/40">
                                                No subscribers found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredSubscribers.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="rounded-xl border border-brand-hairline bg-brand-off p-4 space-y-2 cursor-pointer hover:shadow-card transition-shadow"
                                    onClick={() => setSelected(sub)}
                                >
                                    <div className="flex items-start justify-between">
                                        <p className="font-bold text-brand-charcoal">{sub.email}</p>
                                        <input
                                            type="checkbox"
                                            className="rounded border-brand-hairline text-brand-red focus:ring-brand-red flex-shrink-0"
                                            checked={selectedIds.includes(sub.id)}
                                            onChange={() => toggleSelect(sub.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    {sub.ip && (
                                        <p className="text-xs text-brand-charcoal/40 font-mono">{sub.ip}</p>
                                    )}
                                    <p className="text-xs text-brand-charcoal/40">
                                        {sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                    </p>
                                </div>
                            ))}
                            {filteredSubscribers.length === 0 && (
                                <p className="col-span-full text-center text-sm text-brand-charcoal/40 py-8">No subscribers found.</p>
                            )}
                        </div>
                    )}
                </AdminCard>
            </div>

            <SubmissionDetailDialog
                open={!!selected}
                onClose={() => setSelected(null)}
                submission={selected}
                type="subscribers"
                onDelete={() => selected && handleDelete(selected.id, selected.email)}
            />
        </>
    );
}

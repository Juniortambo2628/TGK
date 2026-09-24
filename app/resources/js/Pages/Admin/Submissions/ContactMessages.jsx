import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { exportCSV } from '../../../lib/csv';
import { useSelectableList } from '../../../hooks/useSelectableList';
import AdminHero from '../../../Components/Admin/AdminHero';
import AdminToolbar from '../../../Components/Admin/AdminToolbar';
import AdminCard from '../../../Components/Admin/AdminCard';
import StatusBadge from '../../../Components/Admin/StatusBadge';
import SubmissionDetailDialog from '../../../Components/Admin/SubmissionDetailDialog';

export default function ContactMessages({ messages = [] }) {
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list');

    const filters = [
        { key: 'all', label: 'All' },
        { key: 'handled', label: 'Handled' },
        { key: 'unhandled', label: 'Unhandled' },
    ];

    const filteredMessages = messages.filter((msg) => {
        const matchesSearch =
            !search ||
            msg.name?.toLowerCase().includes(search.toLowerCase()) ||
            msg.email?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            activeFilter === 'all' ||
            (activeFilter === 'handled' && msg.is_handled) ||
            (activeFilter === 'unhandled' && !msg.is_handled);
        return matchesSearch && matchesFilter;
    });

    const { selectedIds, toggleSelect, toggleSelectAll, handleBulkDelete, clearSelection } = useSelectableList(filteredMessages, { routeName: 'admin.contact-messages.destroy', confirmMessage: 'messages' });

    const handleToggleStatus = (id, currentStatus) => {
        router.patch(
            route('admin.contact-messages.status', id),
            { is_handled: !currentStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Status updated.');
                    setSelected((prev) => (prev?.id === id ? { ...prev, is_handled: !currentStatus } : prev));
                },
            }
        );
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        router.delete(route('admin.contact-messages.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Message deleted.');
                setSelected(null);
            },
        });
    };



    const handleExport = () => {
        exportCSV(filteredMessages, 'contact-messages.csv');
    };

    return (
        <>
            <Head title="Contact Messages" />

            <AdminHero
                title="Contact Messages"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Submissions' },
                    { label: 'Contact Messages' },
                ]}
            />

            <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8 space-y-6">
                <AdminToolbar
                    search={{ value: search, onChange: setSearch, placeholder: 'Search messages...' }}
                    filters={filters}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    bulkActions={[
                        { label: 'Delete', icon: 'trash', onClick: handleBulkDelete, danger: true },
                        { label: 'Export CSV', icon: 'download', onClick: handleExport },
                    ]}
                    selectedCount={selectedIds.length}
                    onSelectAll={toggleSelectAll}
                    onDeselectAll={clearSelection}
                    actions={[
                        { label: 'Export CSV', icon: 'download', onClick: handleExport },
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
                                                checked={selectedIds.length === filteredMessages.length && filteredMessages.length > 0}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Date</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Name</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Email</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Topic</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Status</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-hairline">
                                    {filteredMessages.map((row) => (
                                        <tr key={row.id} className="transition-colors hover:bg-brand-panel/40">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-brand-hairline text-brand-red focus:ring-brand-red"
                                                    checked={selectedIds.includes(row.id)}
                                                    onChange={() => toggleSelect(row.id)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-xs text-brand-charcoal/50">
                                                {row.created_at ? new Date(row.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-brand-charcoal">{row.name}</td>
                                            <td className="px-4 py-3 text-brand-charcoal/70">{row.email}</td>
                                            <td className="px-4 py-3 text-brand-charcoal/70">{row.topic || '—'}</td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={row.is_handled ? 'handled' : 'unhandled'} />
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
                                    {filteredMessages.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-sm text-brand-charcoal/40">
                                                No messages found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="rounded-xl border border-brand-hairline bg-brand-off p-4 space-y-2 cursor-pointer hover:shadow-card transition-shadow"
                                    onClick={() => setSelected(msg)}
                                >
                                    <div className="flex items-start justify-between">
                                        <p className="font-bold text-brand-charcoal">{msg.name}</p>
                                        <input
                                            type="checkbox"
                                            className="rounded border-brand-hairline text-brand-red focus:ring-brand-red flex-shrink-0"
                                            checked={selectedIds.includes(msg.id)}
                                            onChange={() => toggleSelect(msg.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <p className="text-xs text-brand-charcoal/50">{msg.email}</p>
                                    {msg.topic && <p className="text-xs text-brand-charcoal/50">Topic: {msg.topic}</p>}
                                    <StatusBadge status={msg.is_handled ? 'handled' : 'unhandled'} />
                                    <p className="text-xs text-brand-charcoal/40">
                                        {msg.created_at ? new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                    </p>
                                </div>
                            ))}
                            {filteredMessages.length === 0 && (
                                <p className="col-span-full text-center text-sm text-brand-charcoal/40 py-8">No messages found.</p>
                            )}
                        </div>
                    )}
                </AdminCard>
            </div>

            <SubmissionDetailDialog
                open={!!selected}
                onClose={() => setSelected(null)}
                submission={selected}
                type="contact-messages"
                onStatusChange={handleToggleStatus}
                onDelete={handleDelete}
            />
        </>
    );
}

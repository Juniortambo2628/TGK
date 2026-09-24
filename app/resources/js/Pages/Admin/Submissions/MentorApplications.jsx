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

export default function MentorApplications({ applications = [] }) {
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list');

    const filters = [
        { key: 'all', label: 'All' },
        { key: 'new', label: 'New' },
        { key: 'contacted', label: 'Contacted' },
        { key: 'onboarded', label: 'Onboarded' },
        { key: 'declined', label: 'Declined' },
    ];

    const filteredApplications = applications.filter((app) => {
        const matchesSearch =
            !search ||
            app.name?.toLowerCase().includes(search.toLowerCase()) ||
            app.email?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = activeFilter === 'all' || app.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const { selectedIds, toggleSelect, toggleSelectAll, handleBulkDelete, clearSelection } = useSelectableList(filteredApplications, { routeName: 'admin.mentor-applications.destroy', confirmMessage: 'applications' });

    const handleStatusChange = (id, status) => {
        router.patch(
            route('admin.mentor-applications.status', id),
            { status },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Status updated.');
                    setSelected((prev) => (prev?.id === id ? { ...prev, status } : prev));
                },
            }
        );
    };

    const handleDelete = (id) => {
        if (!confirm('Are you sure you want to delete this application?')) return;
        router.delete(route('admin.mentor-applications.destroy', id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Application deleted.');
                setSelected(null);
            },
        });
    };



    const handleExport = () => {
        exportCSV(filteredApplications, 'mentor-applications.csv');
    };

    return (
        <>
            <Head title="Mentor Applications" />

            <AdminHero
                title="Mentor Applications"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Submissions' },
                    { label: 'Mentor Applications' },
                ]}
            />

            <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8 space-y-6">
                <AdminToolbar
                    search={{ value: search, onChange: setSearch, placeholder: 'Search applications...' }}
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
                                                checked={selectedIds.length === filteredApplications.length && filteredApplications.length > 0}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Date</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Name</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Email</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Profession</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Status</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-hairline">
                                    {filteredApplications.map((row) => (
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
                                            <td className="px-4 py-3 text-brand-charcoal/70">{row.profession || '—'}</td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={row.status || 'new'} />
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
                                    {filteredApplications.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-sm text-brand-charcoal/40">
                                                No applications found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredApplications.map((app) => (
                                <div
                                    key={app.id}
                                    className="rounded-xl border border-brand-hairline bg-brand-off p-4 space-y-2 cursor-pointer hover:shadow-card transition-shadow"
                                    onClick={() => setSelected(app)}
                                >
                                    <div className="flex items-start justify-between">
                                        <p className="font-bold text-brand-charcoal">{app.name}</p>
                                        <input
                                            type="checkbox"
                                            className="rounded border-brand-hairline text-brand-red focus:ring-brand-red flex-shrink-0"
                                            checked={selectedIds.includes(app.id)}
                                            onChange={() => toggleSelect(app.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <p className="text-xs text-brand-charcoal/50">{app.email}</p>
                                    {app.profession && <p className="text-xs text-brand-charcoal/50">{app.profession}</p>}
                                    <StatusBadge status={app.status || 'new'} />
                                    <p className="text-xs text-brand-charcoal/40">
                                        {app.created_at ? new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                    </p>
                                </div>
                            ))}
                            {filteredApplications.length === 0 && (
                                <p className="col-span-full text-center text-sm text-brand-charcoal/40 py-8">No applications found.</p>
                            )}
                        </div>
                    )}
                </AdminCard>
            </div>

            <SubmissionDetailDialog
                open={!!selected}
                onClose={() => setSelected(null)}
                submission={selected}
                type="mentor-applications"
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
            />
        </>
    );
}

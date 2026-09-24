import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AdminHero from '../../../Components/Admin/AdminHero';
import AdminToolbar from '../../../Components/Admin/AdminToolbar';
import AdminCard from '../../../Components/Admin/AdminCard';
import { useSelectableList } from '../../../hooks/useSelectableList';

export default function Index({ users = [] }) {
    const { props } = usePage();
    const currentUserId = props.auth?.user?.id;

    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('list');

    const filteredUsers = users.filter((user) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return user.name?.toLowerCase().includes(q) || user.email?.toLowerCase().includes(q);
    });

    const handleDelete = (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
        router.delete(route('admin.users.destroy', id), {
            onSuccess: () => toast.success('User deleted.'),
        });
    };

    const { selectedIds, toggleSelect, toggleSelectAll, handleBulkDelete, clearSelection, selectAllProps, selectedCount } =
        useSelectableList(filteredUsers, { routeName: 'admin.users.destroy', confirmMessage: 'users', skipIds: [currentUserId] });

    return (
        <>
            <Head title="User Accounts" />

            <AdminHero
                title="User Accounts"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Users' },
                    { label: 'User Accounts' },
                ]}
                actions={[{ label: 'New User', href: route('admin.users.create'), icon: 'plus' }]}
            />

            <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8 space-y-6">
                <AdminToolbar
                    search={{ value: search, onChange: setSearch, placeholder: 'Search users...' }}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    bulkActions={[
                        { label: 'Delete', icon: 'trash', onClick: handleBulkDelete, danger: true },
                    ]}
                    selectedCount={selectedCount}
                    onSelectAll={toggleSelectAll}
                    onDeselectAll={clearSelection}
                    actions={[
                        { label: 'New User', href: route('admin.users.create'), icon: 'plus', primary: true },
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
                                                checked={selectAllProps.checked}
                                                onChange={selectAllProps.onChange}
                                            />
                                        </th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Name</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Email</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Created</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-hairline">
                                    {filteredUsers.map((row) => (
                                        <tr key={row.id} className="transition-colors hover:bg-brand-panel/40">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-brand-hairline text-brand-red focus:ring-brand-red"
                                                    checked={selectedIds.includes(row.id)}
                                                    onChange={() => toggleSelect(row.id)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-bold text-brand-charcoal">{row.name}</td>
                                            <td className="px-4 py-3 text-brand-charcoal/70">{row.email}</td>
                                            <td className="px-4 py-3 text-xs text-brand-charcoal/50">
                                                {row.created_at
                                                    ? new Date(row.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                                    : '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-3">
                                                    <Link
                                                        href={route('admin.users.edit', row.id)}
                                                        className="text-sm font-bold text-brand-charcoal/60 hover:text-brand-red transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                    {row.id !== currentUserId && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(row.id, row.name)}
                                                            className="text-sm font-bold text-brand-charcoal/60 hover:text-brand-red transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-brand-charcoal/40">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="rounded-xl border border-brand-hairline bg-brand-off p-4 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red font-bold text-sm">
                                                {user.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-brand-charcoal">{user.name}</p>
                                                <p className="text-xs text-brand-charcoal/50">{user.email}</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="rounded border-brand-hairline text-brand-red focus:ring-brand-red flex-shrink-0"
                                            checked={selectedIds.includes(user.id)}
                                            onChange={() => toggleSelect(user.id)}
                                        />
                                    </div>
                                    <p className="text-xs text-brand-charcoal/40">
                                        Created {user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                    </p>
                                    <div className="flex items-center gap-3 pt-1">
                                        <Link
                                            href={route('admin.users.edit', user.id)}
                                            className="text-xs font-bold text-brand-red hover:text-brand-red-deep transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        {user.id !== currentUserId && (
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(user.id, user.name)}
                                                className="text-xs font-bold text-brand-charcoal/50 hover:text-brand-red transition-colors"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {filteredUsers.length === 0 && (
                                <p className="col-span-full text-center text-sm text-brand-charcoal/40 py-8">No users found.</p>
                            )}
                        </div>
                    )}
                </AdminCard>
            </div>
        </>
    );
}

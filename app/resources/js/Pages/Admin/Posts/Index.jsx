import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AdminHero from '../../../Components/Admin/AdminHero';
import AdminToolbar from '../../../Components/Admin/AdminToolbar';
import AdminCard from '../../../Components/Admin/AdminCard';
import StatusBadge from '../../../Components/Admin/StatusBadge';
import { useSelectableList } from '../../../hooks/useSelectableList';

export default function Index({ posts = [] }) {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [viewMode, setViewMode] = useState('list');

    const filters = [
        { key: 'all', label: 'All' },
        { key: 'published', label: 'Published' },
        { key: 'draft', label: 'Draft' },
    ];

    const filteredPosts = posts.filter((post) => {
        const matchesSearch = !search || post.title?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            activeFilter === 'all' ||
            (activeFilter === 'published' && post.is_published) ||
            (activeFilter === 'draft' && !post.is_published);
        return matchesSearch && matchesFilter;
    });

    const handleDelete = (id, title) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
        router.delete(route('admin.posts.destroy', id), {
            onSuccess: () => toast.success('Story deleted.'),
        });
    };

    const { selectedIds, toggleSelect, toggleSelectAll, handleBulkDelete, clearSelection, selectAllProps, selectedCount } =
        useSelectableList(filteredPosts, { routeName: 'admin.posts.destroy', confirmMessage: 'items' });

    return (
        <>
            <Head title="Stories" />

            <AdminHero
                title="Stories"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Blog', href: '/admin/posts' },
                    { label: 'Stories' },
                ]}
                actions={[{ label: 'New Story', href: route('admin.posts.create'), icon: 'plus' }]}
            />

            <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8 space-y-6">
                <AdminToolbar
                    search={{ value: search, onChange: setSearch, placeholder: 'Search stories...' }}
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
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Title</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Slug</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Status</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Date</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-hairline">
                                    {filteredPosts.map((row) => (
                                        <tr key={row.id} className="transition-colors hover:bg-brand-panel/40">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-brand-hairline text-brand-red focus:ring-brand-red"
                                                    checked={selectedIds.includes(row.id)}
                                                    onChange={() => toggleSelect(row.id)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-bold text-brand-charcoal">{row.title}</td>
                                            <td className="px-4 py-3 text-brand-charcoal/50 font-mono text-xs">{row.slug}</td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={row.is_published ? 'published' : 'draft'} />
                                            </td>
                                            <td className="px-4 py-3 text-xs text-brand-charcoal/50">
                                                {(() => {
                                                    const d = row.published_at || row.created_at;
                                                    return d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                                                })()}
                                            </td>
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-3">
                                                    <Link
                                                        href={route('admin.posts.edit', row.id)}
                                                        className="text-sm font-bold text-brand-charcoal/60 hover:text-brand-red transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(row.id, row.title)}
                                                        className="text-sm font-bold text-brand-charcoal/60 hover:text-brand-red transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPosts.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-8 text-center text-sm text-brand-charcoal/40">
                                                No stories found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredPosts.map((post) => (
                                <div key={post.id} className="rounded-xl border border-brand-hairline bg-brand-off p-4 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <p className="font-bold text-brand-charcoal flex-1 min-w-0 truncate">{post.title}</p>
                                        <input
                                            type="checkbox"
                                            className="rounded border-brand-hairline text-brand-red focus:ring-brand-red ml-2 flex-shrink-0"
                                            checked={selectedIds.includes(post.id)}
                                            onChange={() => toggleSelect(post.id)}
                                        />
                                    </div>
                                    {post.excerpt && (
                                        <p className="text-xs text-brand-charcoal/50 line-clamp-2">{post.excerpt}</p>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={post.is_published ? 'published' : 'draft'} />
                                        <span className="text-xs text-brand-charcoal/40">
                                            {(() => {
                                                const d = post.published_at || post.created_at;
                                                return d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
                                            })()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 pt-1">
                                        <Link
                                            href={route('admin.posts.edit', post.id)}
                                            className="text-xs font-bold text-brand-red hover:text-brand-red-deep transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(post.id, post.title)}
                                            className="text-xs font-bold text-brand-charcoal/50 hover:text-brand-red transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {filteredPosts.length === 0 && (
                                <p className="col-span-full text-center text-sm text-brand-charcoal/40 py-8">No stories found.</p>
                            )}
                        </div>
                    )}
                </AdminCard>
            </div>
        </>
    );
}

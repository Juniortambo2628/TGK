import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import AdminHero from '../../Components/Admin/AdminHero';
import AdminToolbar from '../../Components/Admin/AdminToolbar';
import AdminCard from '../../Components/Admin/AdminCard';
import FileUploader from '../../Components/Admin/FileUploader';

function formatFileSize(bytes) {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

const FOLDER_FILTERS = ['All', 'Stories', 'Landing', 'Gallery', 'Products'];

export default function MediaGallery({ media = [], folders = {} }) {
    const [search, setSearch] = useState('');
    const [activeFolder, setActiveFolder] = useState('All');
    const [viewMode, setViewMode] = useState('grid');
    const [hoveredId, setHoveredId] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState(null);

    const filteredMedia = media.filter((item) => {
        const matchesSearch = !search || item.filename?.toLowerCase().includes(search.toLowerCase());
        const matchesFolder = activeFolder === 'All' || item.folder === activeFolder.toLowerCase();
        return matchesSearch && matchesFolder;
    });

    const handleCopyUrl = (url) => {
        navigator.clipboard.writeText(url).then(() => {
            toast.success('URL copied to clipboard.');
        });
    };

    const handleDelete = (id, filename) => {
        if (!confirm(`Are you sure you want to delete "${filename}"?`)) return;
        router.delete(route('admin.media.destroy', id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Media deleted.'),
        });
    };

    const folderFilterPills = FOLDER_FILTERS.map((f) => ({ key: f, label: f }));

    return (
        <>
            <Head title="Media Gallery" />

            <AdminHero
                title="Media Gallery"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Media Gallery' },
                ]}
            />

            <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8 space-y-6">
                <AdminCard>
                    <div className="p-6">
                        <h3 className="text-sm font-bold text-brand-charcoal mb-2">Upload New Media</h3>
                        <FileUploader
                            value={uploadedUrl}
                            onChange={setUploadedUrl}
                            folder={activeFolder === 'All' ? 'uncategorized' : activeFolder.toLowerCase()}
                            accept="image/*"
                            maxSizeMB={5}
                            maxWidth={1920}
                            quality={0.85}
                            label="Drop image here or click to browse"
                        />
                    </div>
                </AdminCard>

                <AdminToolbar
                    search={{ value: search, onChange: setSearch, placeholder: 'Search media...' }}
                    filters={folderFilterPills}
                    activeFilter={activeFolder}
                    onFilterChange={setActiveFolder}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    actions={[
                        {
                            label: 'Upload',
                            icon: 'plus',
                            primary: true,
                            onClick: () => {
                                setUploadedUrl(null);
                                requestAnimationFrame(() => {
                                    document.querySelector('.filepond--root input[type=file]')?.click();
                                });
                            },
                        },
                    ]}
                />

                {filteredMedia.length === 0 ? (
                    <AdminCard>
                        <div className="p-12 text-center">
                            <p className="text-sm text-brand-charcoal/50">
                                {search || activeFolder !== 'All' ? 'No media matches your filters.' : 'No media uploaded yet.'}
                            </p>
                        </div>
                    </AdminCard>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filteredMedia.map((item) => (
                            <AdminCard key={item.id}>
                                <div
                                    className="group relative overflow-hidden"
                                    onMouseEnter={() => setHoveredId(item.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    <div className="aspect-square overflow-hidden bg-brand-panel">
                                        <img
                                            src={item.url || item.path}
                                            alt={item.filename}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="p-3">
                                        <p className="truncate text-xs font-bold text-brand-charcoal" title={item.filename}>
                                            {item.filename}
                                        </p>
                                        <div className="mt-1 flex items-center gap-2 text-xs text-brand-charcoal/50">
                                            {item.folder && (
                                                <span className="rounded bg-brand-panel px-1.5 py-0.5 text-[10px] font-semibold tracking-wide">
                                                    {item.folder}
                                                </span>
                                            )}
                                            {item.width && item.height && <span>{item.width}x{item.height}</span>}
                                            {item.size && <span>{formatFileSize(item.size)}</span>}
                                        </div>
                                    </div>

                                    {hoveredId === item.id && (
                                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-brand-charcoal/70 backdrop-blur-sm transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => handleCopyUrl(item.url || item.path)}
                                                className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-brand-charcoal shadow-sm transition-colors hover:bg-white"
                                            >
                                                Copy URL
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(item.id, item.filename)}
                                                className="rounded-lg bg-brand-red/90 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-red"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </AdminCard>
                        ))}
                    </div>
                ) : (
                    <AdminCard>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-brand-hairline bg-brand-panel/60">
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Preview</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Filename</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Folder</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50">Size</th>
                                        <th className="px-4 py-3 text-xs font-semibold tracking-wide text-brand-charcoal/50 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-hairline">
                                    {filteredMedia.map((item) => (
                                        <tr key={item.id} className="transition-colors hover:bg-brand-panel/40">
                                            <td className="px-4 py-3">
                                                <img src={item.url || item.path} alt="" className="h-10 w-10 rounded object-cover" />
                                            </td>
                                            <td className="px-4 py-3 font-bold text-brand-charcoal">{item.filename}</td>
                                            <td className="px-4 py-3 text-brand-charcoal/50 text-xs">{item.folder || '—'}</td>
                                            <td className="px-4 py-3 text-brand-charcoal/50 text-xs">{formatFileSize(item.size)}</td>
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopyUrl(item.url || item.path)}
                                                        className="text-sm font-bold text-brand-charcoal/60 hover:text-brand-red transition-colors"
                                                    >
                                                        Copy URL
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id, item.filename)}
                                                        className="text-sm font-bold text-brand-charcoal/60 hover:text-brand-red transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredMedia.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-brand-charcoal/40">
                                                No media found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </AdminCard>
                )}
            </div>
        </>
    );
}

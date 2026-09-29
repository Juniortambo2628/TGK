import { useState, useRef, useEffect, useCallback } from 'react';
import { FilePond } from '../../lib/filepond';
import imageCompression from 'browser-image-compression';
import { imageUrl } from '../../lib/urls';
import { IconPencil, IconTrash, IconPhoto, IconUpload, IconX } from './Icons';

const XSRF = () => decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '');

function parsePosition(pos) {
    const m = String(pos || '50% 50%').match(/(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/);
    return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : { x: 50, y: 50 };
}

export default function FileUploader({
    value = null,
    onChange = () => {},
    folder = 'uploads',
    accept = 'image/*',
    maxSizeMB = 5,
    maxWidth = 1920,
    quality = 0.85,
    label = 'Drop image here or click to browse',
    library = true,
    position = null,
    onPositionChange = null,
}) {
    const [files, setFiles] = useState([]);
    const pondRef = useRef(null);
    const fileInputRef = useRef(null);

    // Uploads store the relative path (e.g. "uploads/library/x.webp"), never an
    // absolute URL, so references round-trip cleanly through edits and survive
    // domain changes. imageUrl() resolves them for display.
    const handleProcessFile = (error, file) => {
        if (error) {
            console.error('Upload error:', error);
            return;
        }
        try {
            const res = JSON.parse(file.serverId);
            if (res?.path) onChange(res.path);
        } catch (e) {
            console.error('Bad upload response:', e);
        }
    };

    const handleRemoveFile = () => {
        onChange(null);
        setFiles([]);
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        const res = await fetch('/admin/media/upload', {
            method: 'POST',
            headers: { 'X-XSRF-TOKEN': XSRF(), 'X-Requested-With': 'XMLHttpRequest' },
            body: formData,
        });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        if (!data.path) throw new Error('No path returned');
        onChange(data.path);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            let upload = file;
            if (file.type.startsWith('image/')) {
                const compressed = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: maxWidth,
                    useWebWorker: true,
                    initialQuality: quality,
                });
                upload = new File([compressed], compressed.name, { type: compressed.type });
            }
            await uploadFile(upload);
        } catch (err) {
            console.error('Upload failed:', err);
        }
        e.target.value = '';
    };

    const server = {
        url: '/admin/media',
        process: {
            url: '/upload',
            method: 'POST',
            headers: { 'X-XSRF-TOKEN': XSRF() },
            formData: { folder },
        },
    };

    return (
        <div className="space-y-2">
            {!value ? (
                <div className="rounded-lg border border-dashed border-brand-hairline overflow-hidden bg-brand-panel/30">
                    <FilePond
                        ref={pondRef}
                        files={files}
                        onupdatefiles={setFiles}
                        onprocessfile={handleProcessFile}
                        name="file"
                        labelIdle={label}
                        acceptedFileTypes={[accept]}
                        maxFileSize={`${maxSizeMB}MB`}
                        allowMultiple={false}
                        server={server}
                        className="filepond--root"
                        styleButtonProcessItemPosition="right"
                    />
                </div>
            ) : (
                <ImagePreview
                    value={value}
                    position={position}
                    onPositionChange={onPositionChange}
                    onReplace={() => fileInputRef.current?.click()}
                    onRemove={handleRemoveFile}
                />
            )}

            <input ref={fileInputRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} />

            {library && (
                <LibraryButton folder={folder} value={value} onChange={onChange} />
            )}
        </div>
    );
}

/**
 * Image preview. When onPositionChange is provided, the image doubles as a
 * focal-point picker: drag (or click) to choose the point that stays in frame
 * so key parts of the photo aren't cropped out of the fixed card/hero shapes.
 */
function ImagePreview({ value, position, onPositionChange, onReplace, onRemove }) {
    const boxRef = useRef(null);
    const dragging = useRef(false);
    const adjustable = typeof onPositionChange === 'function';
    const pos = parsePosition(position);

    const setFromEvent = useCallback((e) => {
        const box = boxRef.current;
        if (!box) return;
        const rect = box.getBoundingClientRect();
        const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
        onPositionChange(`${Math.round(x)}% ${Math.round(y)}%`);
    }, [onPositionChange]);

    const onPointerDown = (e) => {
        if (!adjustable) return;
        dragging.current = true;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        setFromEvent(e);
    };
    const onPointerMove = (e) => { if (adjustable && dragging.current) setFromEvent(e); };
    const onPointerUp = (e) => {
        if (!adjustable) return;
        dragging.current = false;
        e.currentTarget.releasePointerCapture?.(e.pointerId);
    };

    return (
        <div>
            <div
                ref={boxRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                className={`relative group rounded-lg border border-brand-hairline overflow-hidden bg-brand-panel/30 ${adjustable ? 'cursor-move touch-none' : ''}`}
            >
                <img
                    src={imageUrl(value)}
                    alt="Uploaded image"
                    className="w-full h-48 object-cover select-none"
                    style={adjustable ? { objectPosition: `${pos.x}% ${pos.y}%` } : undefined}
                    draggable={false}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className="hidden w-full h-48 items-center justify-center bg-brand-panel text-brand-charcoal/40 text-sm">
                    <span>Image preview unavailable</span>
                </div>

                {adjustable && (
                    <div
                        className="pointer-events-none absolute h-6 w-6 -ml-3 -mt-3 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,0.35)] ring-2 ring-brand-red/70"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    />
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button type="button" onClick={onReplace} className="inline-flex items-center gap-1.5 bg-white text-brand-charcoal rounded-lg px-3 py-2 text-xs font-bold hover:bg-brand-panel transition-colors shadow-sm">
                        <IconPencil className="w-3.5 h-3.5" />
                        Replace
                    </button>
                    <button type="button" onClick={onRemove} className="inline-flex items-center gap-1.5 bg-brand-red text-white rounded-lg px-3 py-2 text-xs font-bold hover:bg-brand-red-deep transition-colors shadow-sm">
                        <IconTrash className="w-3.5 h-3.5" />
                        Remove
                    </button>
                </div>
            </div>
            {adjustable && (
                <p className="mt-1.5 text-xs text-brand-charcoal/50">Drag on the image to reposition how it sits inside cards and the story header.</p>
            )}
        </div>
    );
}

/** "Select from Media Library" trigger + modal. Picks an existing image so the
 *  library stays clean instead of re-uploading duplicates. */
function LibraryButton({ folder, value, onChange }) {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        setLoading(true);
        fetch('/admin/media/library', { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then((res) => res.json())
            .then((data) => setItems(data.media || []))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, [open]);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-charcoal/60 hover:text-brand-red transition-colors"
            >
                <IconPhoto className="w-3.5 h-3.5" />
                Select from media library
            </button>

            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-card w-full max-w-3xl max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-hairline">
                            <h3 className="text-lg font-bold text-brand-charcoal">Select from media library</h3>
                            <button type="button" onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-brand-panel text-brand-charcoal/40 hover:text-brand-charcoal transition-colors">
                                <IconX className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {loading ? (
                                <div className="flex items-center justify-center py-12 text-brand-charcoal/40 text-sm">Loading images…</div>
                            ) : items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-brand-charcoal/40 text-sm">
                                    <IconUpload className="w-6 h-6" />
                                    <p className="mt-2">No images in the library yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {items.map((img) => {
                                        const selected = value === img.path || value === img.url;
                                        return (
                                            <button
                                                key={img.id || img.path}
                                                type="button"
                                                title={img.name}
                                                onClick={() => { onChange(img.path); setOpen(false); }}
                                                className={`aspect-square rounded-lg border-2 overflow-hidden transition-all hover:ring-2 hover:ring-brand-red/50 ${selected ? 'border-brand-red ring-2 ring-brand-red/30' : 'border-brand-hairline'}`}
                                            >
                                                <img src={img.url} alt={img.name} loading="lazy" className="w-full h-full object-cover" />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

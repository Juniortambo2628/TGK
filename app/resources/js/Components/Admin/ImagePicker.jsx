import { useState, useEffect } from 'react';
import { FilePond } from '../../lib/filepond';
import imageCompression from 'browser-image-compression';

export default function ImagePicker({
    value = null,
    onChange = () => {},
    folder = 'media',
    label = 'Select image',
}) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState('gallery');
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (open && tab === 'gallery') {
            setLoading(true);
            fetch(`/admin/media?folder=${folder}`)
                .then((res) => res.json())
                .then((data) => {
                    setGalleryImages(data.data || data || []);
                })
                .catch(() => setGalleryImages([]))
                .finally(() => setLoading(false));
        }
    }, [open, tab, folder]);

    const handleProcessFile = (error, file) => {
        if (error) return;
        const serverResponse = JSON.parse(file.serverId);
        if (serverResponse?.url) {
            onChange(serverResponse.url);
            setOpen(false);
            setFiles([]);
        }
    };

    const handleAddFileStart = async (file) => {
        if (file.file.type.startsWith('image/')) {
            try {
                const compressedFile = await imageCompression(file.file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    initialQuality: 0.85,
                });
                file.file = compressedFile;
                file.setFilename(compressedFile.name);
            } catch (err) {
                console.error('Compression failed:', err);
            }
        }
    };

    return (
        <div>
            <div className="flex items-center gap-3">
                {value && (
                    <div className="relative group w-20 h-20 rounded-lg border border-brand-hairline overflow-hidden flex-shrink-0">
                        <img src={value} alt="Selected" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold"
                        >
                            Remove
                        </button>
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-brand-hairline bg-white px-4 py-2.5 text-sm font-bold text-brand-charcoal hover:bg-brand-panel transition-colors"
                >
                    <IconPhoto />
                    {value ? 'Change image' : label}
                </button>
            </div>

            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-card w-full max-w-2xl max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-hairline">
                            <h3 className="text-lg font-bold text-brand-charcoal">{label}</h3>
                            <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-brand-panel text-brand-charcoal/40 hover:text-brand-charcoal transition-colors">
                                <IconX />
                            </button>
                        </div>

                        <div className="flex border-b border-brand-hairline">
                            <button
                                onClick={() => setTab('gallery')}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors ${
                                    tab === 'gallery'
                                        ? 'text-brand-red border-b-2 border-brand-red'
                                        : 'text-brand-charcoal/50 hover:text-brand-charcoal'
                                }`}
                            >
                                <IconPhoto />
                                Gallery
                            </button>
                            <button
                                onClick={() => setTab('upload')}
                                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors ${
                                    tab === 'upload'
                                        ? 'text-brand-red border-b-2 border-brand-red'
                                        : 'text-brand-charcoal/50 hover:text-brand-charcoal'
                                }`}
                            >
                                <IconUpload />
                                Upload
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {tab === 'gallery' && (
                                <div>
                                    {loading ? (
                                        <div className="flex items-center justify-center py-12 text-brand-charcoal/40 text-sm">
                                            Loading images...
                                        </div>
                                    ) : galleryImages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-brand-charcoal/40 text-sm">
                                            <IconPhoto />
                                            <p className="mt-2">No images found in this folder.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-4 gap-3">
                                            {galleryImages.map((img, i) => {
                                                const url = typeof img === 'string' ? img : img.url;
                                                return (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => {
                                                            onChange(url);
                                                            setOpen(false);
                                                        }}
                                                        className={`aspect-square rounded-lg border-2 overflow-hidden transition-all hover:ring-2 hover:ring-brand-red/50 ${
                                                            value === url ? 'border-brand-red ring-2 ring-brand-red/30' : 'border-brand-hairline'
                                                        }`}
                                                    >
                                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {tab === 'upload' && (
                                <div className="rounded-lg border border-brand-hairline overflow-hidden">
                                    <FilePond
                                        files={files}
                                        onupdatefiles={setFiles}
                                        onprocessfile={handleProcessFile}
                                        onaddfilestart={handleAddFileStart}
                                        name="file"
                                        labelIdle="Drop image here or click to browse"
                                        acceptedFileTypes={['image/*']}
                                        maxFileSize="5MB"
                                        allowMultiple={false}
                                        server={{
                                            url: '/admin/media',
                                            process: {
                                                url: '/upload',
                                                method: 'POST',
                                                headers: {
                                                    'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''),
                                                },
                                                formData: { folder },
                                            },
                                        }}
                                        className="filepond--root"
                                        styleButtonProcessItemPosition="right"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

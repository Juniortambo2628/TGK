import { useState, useRef } from 'react';
import { FilePond } from '../../lib/filepond';
import imageCompression from 'browser-image-compression';
import { imageUrl } from '../../lib/urls';

export default function FileUploader({
    value = null,
    onChange = () => {},
    folder = 'uploads',
    accept = 'image/*',
    maxSizeMB = 5,
    maxWidth = 1920,
    quality = 0.85,
    label = 'Drop image here or click to browse',
}) {
    const [files, setFiles] = useState([]);
    const pondRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleProcessFile = (error, file) => {
        if (error) {
            console.error('Upload error:', error);
            return;
        }
        const serverResponse = JSON.parse(file.serverId);
        if (serverResponse && serverResponse.url) {
            onChange(serverResponse.url);
        }
    };

    const handleRemoveFile = () => {
        onChange(null);
        setFiles([]);
    };

    const handleReplaceFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type.startsWith('image/')) {
            try {
                const compressedFile = await imageCompression(file, {
                    maxSizeMB: 1,
                    maxWidthOrHeight: maxWidth,
                    useWebWorker: true,
                    initialQuality: quality,
                });
                const pondFile = new File([compressedFile], compressedFile.name, { type: compressedFile.type });
                setFiles([pondFile]);
            } catch (err) {
                console.error('Compression failed:', err);
                setFiles([file]);
            }
        } else {
            setFiles([file]);
        }
        e.target.value = '';
    };

    if (!value) {
        return (
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
        );
    }

    return (
        <div className="relative group rounded-lg border border-brand-hairline overflow-hidden bg-brand-panel/30">
            <img
                src={imageUrl(value)}
                alt="Uploaded image"
                className="w-full h-48 object-cover"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div className="hidden w-full h-48 items-center justify-center bg-brand-panel text-brand-charcoal/40 text-sm">
                <span>Image preview unavailable</span>
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={handleFileChange}
                />
                <button
                    type="button"
                    onClick={handleReplaceFile}
                    className="inline-flex items-center gap-1.5 bg-white text-brand-charcoal rounded-lg px-3 py-2 text-xs font-bold hover:bg-brand-panel transition-colors shadow-sm"
                >
                    <IconPencil className="w-3.5 h-3.5" />
                    Replace
                </button>
                <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="inline-flex items-center gap-1.5 bg-brand-red text-white rounded-lg px-3 py-2 text-xs font-bold hover:bg-brand-red-deep transition-colors shadow-sm"
                >
                    <IconTrash className="w-3.5 h-3.5" />
                    Remove
                </button>
            </div>
        </div>
    );
}

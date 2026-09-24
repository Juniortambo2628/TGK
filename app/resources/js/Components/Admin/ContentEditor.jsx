import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import AdminHero from './AdminHero';
import AdminCard from './AdminCard';
import StickySaveBar from './StickySaveBar';
import FileUploader from './FileUploader';
import ProductsEditor from './ProductsEditor';
import ListEditor from './ListEditor';
import LinkPicker from './LinkPicker';
import RichTextEditor from './RichTextEditor';
import { imageUrl } from '../../lib/urls';
import { IconPencil, IconTrash, IconPhoto } from './Icons';

function TabButton({ label, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-bold transition-colors ${
                active
                    ? 'border-brand-red text-brand-red'
                    : 'border-transparent text-brand-charcoal/50 hover:text-brand-charcoal/70'
            }`}
        >
            {label}
        </button>
    );
}

function TextInput({ label, name, value, onChange, error, placeholder, required = false }) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-bold text-brand-charcoal mb-1.5">
                {label} {required && <span className="text-brand-red">*</span>}
            </label>
            <input
                id={name}
                type="text"
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                placeholder={placeholder}
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 ${
                    error ? 'border-brand-red' : 'border-brand-hairline'
                }`}
            />
            {error && <p className="mt-1.5 text-xs text-brand-red">{error}</p>}
        </div>
    );
}

function TextareaInput({ label, name, value, onChange, error, placeholder, required = false }) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-bold text-brand-charcoal mb-1.5">
                {label} {required && <span className="text-brand-red">*</span>}
            </label>
            <textarea
                id={name}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                rows={4}
                placeholder={placeholder}
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 ${
                    error ? 'border-brand-red' : 'border-brand-hairline'
                }`}
            />
            {error && <p className="mt-1.5 text-xs text-brand-red">{error}</p>}
        </div>
    );
}

function RichTextareaInput({ label, name, value, onChange, error, placeholder, required = false }) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-bold text-brand-charcoal mb-1.5">
                {label} {required && <span className="text-brand-red">*</span>}
            </label>
            <RichTextEditor
                value={value || ''}
                onChange={(html) => onChange(name, html)}
                error={error}
                placeholder={placeholder}
            />
        </div>
    );
}

function ImageField({ label, name, value, onChange, error, folder = 'uploads' }) {
    return (
        <div>
            <label className="block text-sm font-bold text-brand-charcoal mb-1.5">{label}</label>
            <FileUploader
                value={value}
                onChange={(url) => onChange(name, url)}
                folder={folder}
            />
            {error && <p className="mt-1.5 text-xs text-brand-red">{error}</p>}
        </div>
    );
}

function GalleryField({ label, name, value, onChange, error, folder = 'uploads' }) {
    const images = Array.isArray(value) ? value : [];

    const addImage = () => {
        onChange(name, [...images, '']);
    };

    const updateImage = (index, url) => {
        const updated = [...images];
        updated[index] = url;
        onChange(name, updated);
    };

    const removeImage = (index) => {
        onChange(name, images.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label className="block text-sm font-bold text-brand-charcoal mb-1.5">{label}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {images.map((image, index) => (
                    <div key={index} className="relative group">
                        <FileUploader
                            value={image}
                            onChange={(url) => updateImage(index, url)}
                            folder={folder}
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 z-10 rounded-full bg-white/90 p-1 text-brand-charcoal/50 hover:text-brand-red hover:bg-white shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={addImage}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-red hover:text-brand-red-deep transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Image
            </button>
            {error && <p className="mt-1.5 text-xs text-brand-red">{error}</p>}
        </div>
    );
}

function RepeaterField({ label, name, value, onChange, error, fields, placeholder }) {
    const items = Array.isArray(value) ? value : [];

    const addItem = () => {
        const empty = {};
        fields.forEach((f) => { empty[f.key] = ''; });
        onChange(name, [...items, empty]);
    };

    const updateItem = (index, fieldKey, fieldValue) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [fieldKey]: fieldValue };
        onChange(name, updated);
    };

    const removeItem = (index) => {
        onChange(name, items.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label className="block text-sm font-bold text-brand-charcoal mb-1.5">{label}</label>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="rounded-lg border border-brand-hairline p-4 space-y-3 bg-brand-panel/20">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-brand-charcoal/50">#{index + 1}</span>
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-xs font-bold text-brand-charcoal/40 hover:text-brand-red transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                        {fields.map((field) => (
                            <div key={field.key}>
                                <label className="block text-xs font-bold text-brand-charcoal/60 mb-1">{field.label}</label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        value={item[field.key] || ''}
                                        onChange={(e) => updateItem(index, field.key, e.target.value)}
                                        rows={2}
                                        placeholder={field.placeholder}
                                        className="w-full rounded-lg border border-brand-hairline bg-white px-3 py-2 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={item[field.key] || ''}
                                        onChange={(e) => updateItem(index, field.key, e.target.value)}
                                        placeholder={field.placeholder}
                                        className="w-full rounded-lg border border-brand-hairline bg-white px-3 py-2 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <button
                type="button"
                onClick={addItem}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-red hover:text-brand-red-deep transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add {label.replace(/s$/, '')}
            </button>
            {items.length === 0 && (
                <p className="text-xs text-brand-charcoal/40 italic mt-2">No items yet. Click the button above to add one.</p>
            )}
            {error && <p className="mt-1.5 text-xs text-brand-red">{error}</p>}
        </div>
    );
}

function ServicesListField({ label, name, value, onChange, error }) {
    return (
        <div>
            <label className="block text-sm font-bold text-brand-charcoal mb-1.5">{label}</label>
            <ListEditor
                value={value}
                onChange={(items) => onChange(name, items)}
                placeholder="Add a service..."
            />
            {error && <p className="mt-1.5 text-xs text-brand-red">{error}</p>}
        </div>
    );
}

function ProductsField({ label, name, value, onChange, error }) {
    return (
        <div>
            <label className="block text-sm font-bold text-brand-charcoal mb-1.5">{label}</label>
            <ProductsEditor
                value={value}
                onChange={(items) => onChange(name, items)}
            />
            {error && <p className="mt-1.5 text-xs text-brand-red">{error}</p>}
        </div>
    );
}

function LinkPickerField({ label, name, value, onChange, error }) {
    return (
        <div>
            <LinkPicker
                label={label}
                value={value || ''}
                onChange={(url) => onChange(name, url)}
            />
            {error && <p className="mt-1.5 text-xs text-brand-red">{error}</p>}
        </div>
    );
}

function FieldRenderer({ field, value, onChange, error }) {
    switch (field.type) {
        case 'textarea':
            if (field.richText) {
                return (
                    <RichTextareaInput
                        label={field.label}
                        name={field.key}
                        value={value || ''}
                        onChange={onChange}
                        error={error}
                        placeholder={field.placeholder}
                        required={field.required}
                    />
                );
            }
            return (
                <TextareaInput
                    label={field.label}
                    name={field.key}
                    value={value || ''}
                    onChange={onChange}
                    error={error}
                    placeholder={field.placeholder}
                    required={field.required}
                />
            );
        case 'image':
            return (
                <ImageField
                    label={field.label}
                    name={field.key}
                    value={value}
                    onChange={onChange}
                    error={error}
                    folder={field.folder || 'uploads'}
                />
            );
        case 'gallery':
            return (
                <GalleryField
                    label={field.label}
                    name={field.key}
                    value={value}
                    onChange={onChange}
                    error={error}
                    folder={field.folder || 'uploads'}
                />
            );
        case 'repeater':
            return (
                <RepeaterField
                    label={field.label}
                    name={field.key}
                    value={value}
                    onChange={onChange}
                    error={error}
                    fields={field.fields || []}
                    placeholder={field.placeholder}
                />
            );
        case 'services-list':
            return (
                <ServicesListField
                    label={field.label}
                    name={field.key}
                    value={value}
                    onChange={onChange}
                    error={error}
                />
            );
        case 'products-editor':
            return (
                <ProductsField
                    label={field.label}
                    name={field.key}
                    value={value}
                    onChange={onChange}
                    error={error}
                />
            );
        case 'link-picker':
            return (
                <LinkPickerField
                    label={field.label}
                    name={field.key}
                    value={value}
                    onChange={onChange}
                    error={error}
                />
            );
        default:
            return (
                <TextInput
                    label={field.label}
                    name={field.key}
                    value={value || ''}
                    onChange={onChange}
                    error={error}
                    placeholder={field.placeholder}
                    required={field.required}
                />
            );
    }
}

function flattenBlocks(tabs, blocks) {
    const flat = {};
    for (const tab of tabs) {
        for (const field of tab.fields) {
            flat[field.key] = blocks[field.key] !== undefined ? blocks[field.key] : (field.type === 'gallery' || field.type === 'repeater' || field.type === 'services-list' || field.type === 'products-editor' ? [] : '');
        }
    }
    return flat;
}

function HeroGallery({ images = [], folder = 'uploads', onChange, error }) {
    const [activeSlide, setActiveSlide] = useState(0);
    const fileInputRef = useRef(null);

    const imageList = Array.isArray(images) ? images : [];
    const currentImage = imageList[activeSlide] || '';

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        try {
            const res = await fetch('/admin/media/upload', {
                method: 'POST',
                headers: {
                    'X-XSRF-TOKEN': decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''),
                },
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                const updated = [...images];
                updated[activeSlide] = data.url;
                onChange(updated);
            }
        } catch (err) {
            console.error('Upload failed:', err);
        }
        e.target.value = '';
    };

    const handleRemove = () => {
        const updated = images.filter((_, i) => i !== activeSlide);
        onChange(updated);
        if (activeSlide >= updated.length) {
            setActiveSlide(Math.max(0, updated.length - 1));
        }
    };

    const handleAddSlide = () => {
        onChange([...images, '']);
        setActiveSlide(images.length);
    };

    return (
        <div className="space-y-3">
            {imageList.length > 1 && (
                <div className="flex items-center gap-1 bg-brand-panel rounded-lg p-1">
                    {imageList.map((_, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveSlide(idx)}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${
                                activeSlide === idx
                                    ? 'bg-white text-brand-charcoal shadow-sm'
                                    : 'text-brand-charcoal/50 hover:text-brand-charcoal/70'
                            }`}
                        >
                            Slide {idx + 1}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddSlide}
                        className="px-2 py-1.5 text-xs font-bold text-brand-red hover:text-brand-red-deep transition-colors"
                    >
                        + Add
                    </button>
                </div>
            )}

            <div className="relative rounded-xl border border-brand-hairline overflow-hidden bg-brand-panel/30">
                {currentImage ? (
                    <img
                        src={imageUrl(currentImage)}
                        alt={`Slide ${activeSlide + 1}`}
                        className="w-full h-48 object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                ) : (
                    <div className="w-full h-48 flex items-center justify-center text-brand-charcoal/40 text-sm">
                        <span>No image set</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 bg-white text-brand-charcoal rounded-lg px-3 py-2 text-xs font-bold hover:bg-brand-panel transition-colors shadow-sm"
                    >
                        <IconPencil className="w-3.5 h-3.5" />
                        Upload
                    </button>
                    {imageList.length > 1 && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="inline-flex items-center gap-1.5 bg-brand-red text-white rounded-lg px-3 py-2 text-xs font-bold hover:bg-brand-red-deep transition-colors shadow-sm"
                        >
                            <IconTrash className="w-3.5 h-3.5" />
                            Remove
                        </button>
                    )}
                </div>
            </div>

            {imageList.length <= 1 && (
                <button
                    type="button"
                    onClick={handleAddSlide}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-red hover:text-brand-red-deep transition-colors"
                >
                    <IconPhoto className="w-4 h-4" />
                    Add Slide
                </button>
            )}

            {error && <p className="text-xs text-brand-red">{error}</p>}
        </div>
    );
}

export default function ContentEditor({
    pageSlug,
    pageTitle,
    pageDescription,
    blocks = {},
    tabs = [],
    route: updateRoute,
    breadcrumbs = [],
}) {
    const flatBlocks = flattenBlocks(tabs, blocks);

    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        blocks: flatBlocks,
    });

    const [activeTab, setActiveTab] = useState(tabs[0]?.key || '');

    useEffect(() => {
        if (recentlySuccessful) {
            toast.success('Changes saved successfully.', {
                duration: 3000,
                style: {
                    borderRadius: '10px',
                    background: '#353536',
                    color: '#fff',
                    fontSize: '14px',
                },
            });
        }
    }, [recentlySuccessful]);

    const handleFieldChange = (key, value) => {
        setData('blocks', {
            ...data.blocks,
            [key]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(updateRoute, {
            preserveScroll: true,
        });
    };

    const autoBreadcrumbs = breadcrumbs.length > 0
        ? breadcrumbs
        : [
            { label: 'Dashboard', href: '/admin' },
            { label: 'Content' },
            { label: pageTitle },
        ];

    const activeTabConfig = tabs.find((t) => t.key === activeTab);

    const heroGalleryField = activeTabConfig?.fields.find((f) => f.type === 'gallery');
    const bodyFields = activeTabConfig?.fields.filter((f) => f.type !== 'gallery') || [];

    return (
        <>
            <Head title={`${pageTitle} Content`} />

            <AdminHero
                title={`${pageTitle} Content`}
                description={pageDescription || `Edit the content blocks for the ${pageTitle.toLowerCase()} page.`}
                breadcrumbs={autoBreadcrumbs}
            />

            <form onSubmit={handleSubmit}>
                <div className="px-6 py-6 max-w-7xl mx-auto sm:px-8 space-y-6">
                    <AdminCard
                        header={
                            <div className="space-y-4">
                                {tabs.length > 1 && (
                                    <div className="overflow-x-auto -mx-6 px-6">
                                        <div className="flex">
                                            {tabs.map((tab) => (
                                                <TabButton
                                                    key={tab.key}
                                                    label={tab.label}
                                                    active={activeTab === tab.key}
                                                    onClick={() => setActiveTab(tab.key)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {heroGalleryField && (
                                    <div className="px-6 pb-4">
                                        <HeroGallery
                                            images={data.blocks[heroGalleryField.key]}
                                            folder={heroGalleryField.folder || 'uploads'}
                                            onChange={(images) => handleFieldChange(heroGalleryField.key, images)}
                                            error={errors[`blocks.${heroGalleryField.key}`]}
                                        />
                                    </div>
                                )}
                            </div>
                        }
                    >
                        <div className="p-6 lg:p-8">
                            {activeTabConfig && (
                                <div className="space-y-6">
                                    {bodyFields.map((field) => (
                                        <FieldRenderer
                                            key={field.key}
                                            field={field}
                                            value={data.blocks[field.key]}
                                            onChange={handleFieldChange}
                                            error={errors[`blocks.${field.key}`]}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </AdminCard>
                </div>

                <StickySaveBar
                    processing={processing}
                    recentlySuccessful={recentlySuccessful}
                    submitLabel="Save changes"
                />
            </form>
        </>
    );
}

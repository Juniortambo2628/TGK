import { useState } from 'react';
import FileUploader from './FileUploader';
import { IconChevronDown, IconChevronUp, IconPlus, IconTrash, IconPlusCircle, IconMinusCircle, IconX } from './Icons';

function createEmptyProduct() {
    return {
        name: '',
        slug: '',
        blurb: '',
        details: [],
        images: [],
    };
}

function DetailInput({ value, onChange, onRemove }) {
    return (
        <div className="flex items-center gap-2">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 rounded-lg border border-brand-hairline bg-white px-3 py-1.5 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30"
                placeholder="Bullet point..."
            />
            <button
                type="button"
                onClick={onRemove}
                className="shrink-0 rounded p-1 text-brand-charcoal/40 hover:text-brand-red hover:bg-brand-red/5 transition-colors"
            >
                <IconMinusCircle className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

function ProductCard({ product, index, onChange, onRemove, onToggle }) {
    const [expanded, setExpanded] = useState(index === 0);

    const update = (field, value) => {
        onChange(index, { ...product, [field]: value });
    };

    const addDetail = () => {
        update('details', [...(product.details || []), '']);
    };

    const updateDetail = (detailIndex, value) => {
        const updated = [...(product.details || [])];
        updated[detailIndex] = value;
        update('details', updated);
    };

    const removeDetail = (detailIndex) => {
        update('details', (product.details || []).filter((_, i) => i !== detailIndex));
    };

    const addImage = () => {
        update('images', [...(product.images || []), '']);
    };

    const updateImage = (imageIndex, url) => {
        const updated = [...(product.images || [])];
        updated[imageIndex] = url;
        update('images', updated);
    };

    const removeImage = (imageIndex) => {
        update('images', (product.images || []).filter((_, i) => i !== imageIndex));
    };

    return (
        <div className="rounded-lg border border-brand-hairline overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-brand-panel/50">
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-2 flex-1 text-left"
                >
                    {expanded ? <IconChevronUp className="w-4 h-4" /> : <IconChevronDown className="w-4 h-4" />}
                    <span className="text-sm font-bold text-brand-charcoal">
                        {product.name || `Product ${index + 1}`}
                    </span>
                    {!product.name && (
                        <span className="text-xs text-brand-charcoal/40 italic">(untitled)</span>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="rounded p-1.5 text-brand-charcoal/40 hover:text-brand-red hover:bg-brand-red/5 transition-colors"
                >
                    <IconTrash className="w-4 h-4" />
                </button>
            </div>

            {expanded && (
                <div className="p-4 space-y-4 border-t border-brand-hairline">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-brand-charcoal/60 mb-1">Name</label>
                            <input
                                type="text"
                                value={product.name}
                                onChange={(e) => update('name', e.target.value)}
                                placeholder="Product name"
                                className="w-full rounded-lg border border-brand-hairline bg-white px-3.5 py-2 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-charcoal/60 mb-1">Slug</label>
                            <input
                                type="text"
                                value={product.slug}
                                onChange={(e) => update('slug', e.target.value)}
                                placeholder="product-slug"
                                className="w-full rounded-lg border border-brand-hairline bg-white px-3.5 py-2 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-brand-charcoal/60 mb-1">Blurb (max 400 chars)</label>
                        <textarea
                            value={product.blurb}
                            onChange={(e) => update('blurb', e.target.value.slice(0, 400))}
                            rows={3}
                            placeholder="Short description..."
                            className="w-full rounded-lg border border-brand-hairline bg-white px-3.5 py-2 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30"
                        />
                        <p className="text-xs text-brand-charcoal/40 mt-1">{(product.blurb || '').length}/400</p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-brand-charcoal/60">Details (bullet points)</label>
                            <button
                                type="button"
                                onClick={addDetail}
                                className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:text-brand-red-deep transition-colors"
                            >
                                <IconPlusCircle className="w-3.5 h-3.5" /> Add point
                            </button>
                        </div>
                        <div className="space-y-2">
                            {(product.details || []).map((detail, di) => (
                                <DetailInput
                                    key={di}
                                    value={detail}
                                    onChange={(v) => updateDetail(di, v)}
                                    onRemove={() => removeDetail(di)}
                                />
                            ))}
                            {(!product.details || product.details.length === 0) && (
                                <p className="text-xs text-brand-charcoal/40 italic">No details yet. Click "Add point" above.</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-brand-charcoal/60">Images</label>
                            <button
                                type="button"
                                onClick={addImage}
                                className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:text-brand-red-deep transition-colors"
                            >
                                <IconPlusCircle className="w-3.5 h-3.5" /> Add image
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(product.images || []).map((image, ii) => (
                                <div key={ii} className="relative group">
                                    <FileUploader
                                        value={image}
                                        onChange={(url) => updateImage(ii, url)}
                                        folder="stawi-products"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(ii)}
                                        className="absolute top-2 right-2 z-10 rounded-full bg-white/90 p-1 text-brand-charcoal/50 hover:text-brand-red hover:bg-white shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <IconX className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {(!product.images || product.images.length === 0) && (
                            <p className="text-xs text-brand-charcoal/40 italic">No images yet. Click "Add image" above.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ProductsEditor({ value = [], onChange = () => {} }) {
    const products = Array.isArray(value) ? value : [];

    const addProduct = () => {
        onChange([...products, createEmptyProduct()]);
    };

    const updateProduct = (index, updated) => {
        const next = [...products];
        next[index] = updated;
        onChange(next);
    };

    const removeProduct = (index) => {
        onChange(products.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            {products.map((product, index) => (
                <ProductCard
                    key={index}
                    product={product}
                    index={index}
                    onChange={updateProduct}
                    onRemove={removeProduct}
                />
            ))}

            <button
                type="button"
                onClick={addProduct}
                className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand-hairline py-3 text-sm font-bold text-brand-charcoal/50 hover:border-brand-red hover:text-brand-red transition-colors"
            >
                <IconPlus className="w-4 h-4" />
                Add Product
            </button>

            {products.length === 0 && (
                <p className="text-xs text-brand-charcoal/40 italic text-center">No products yet. Click "Add Product" to get started.</p>
            )}
        </div>
    );
}

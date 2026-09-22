import { useState } from 'react';
import { IconX, IconPlus } from './Icons';

export default function ListEditor({ value = [], onChange = () => {}, placeholder = 'Add an item...' }) {
    const [newItem, setNewItem] = useState('');

    const items = Array.isArray(value) ? value : [];

    const handleAdd = () => {
        const trimmed = newItem.trim();
        if (trimmed && !items.includes(trimmed)) {
            onChange([...items, trimmed]);
            setNewItem('');
        }
    };

    const handleRemove = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="space-y-2">
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                            const updated = [...items];
                            updated[index] = e.target.value;
                            onChange(updated);
                        }}
                        className="flex-1 rounded-lg border border-brand-hairline bg-white px-3.5 py-2 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30"
                    />
                    <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="shrink-0 rounded-lg p-2 text-brand-charcoal/40 hover:text-brand-red hover:bg-brand-red/5 transition-colors"
                    >
                        <IconX className="w-4 h-4" />
                    </button>
                </div>
            ))}

            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 rounded-lg border border-dashed border-brand-hairline bg-white px-3.5 py-2 text-sm text-brand-charcoal placeholder-brand-charcoal/40 outline-none transition-shadow focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red"
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!newItem.trim()}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-brand-red px-3 py-2 text-sm font-bold text-white transition-all hover:bg-brand-red-deep disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <IconPlus className="w-4 h-4" />
                    Add
                </button>
            </div>

            {items.length === 0 && (
                <p className="text-xs text-brand-charcoal/40 italic">No items yet. Add one above.</p>
            )}
        </div>
    );
}

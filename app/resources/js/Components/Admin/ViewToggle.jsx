import { IconGrid, IconList } from './Icons';

export default function ViewToggle({ mode = 'list', onChange = () => {} }) {
    return (
        <div className="inline-flex items-center rounded-lg border border-brand-hairline overflow-hidden">
            <button
                onClick={() => onChange('grid')}
                className={`p-1.5 transition-colors ${
                    mode === 'grid'
                        ? 'bg-brand-red text-white'
                        : 'text-brand-charcoal/40 hover:text-brand-charcoal'
                }`}
            >
                <IconGrid className="w-4 h-4" />
            </button>
            <button
                onClick={() => onChange('list')}
                className={`p-1.5 transition-colors ${
                    mode === 'list'
                        ? 'bg-brand-red text-white'
                        : 'text-brand-charcoal/40 hover:text-brand-charcoal'
                }`}
            >
                <IconList className="w-4 h-4" />
            </button>
        </div>
    );
}

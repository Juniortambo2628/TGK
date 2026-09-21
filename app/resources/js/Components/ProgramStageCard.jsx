import { StaggerItem } from './Motion';

export default function ProgramStageCard({ stage, name, swahili, duration, description, exit, index }) {
    return (
        <StaggerItem>
            <div className="group relative h-full flex flex-col rounded-3xl bg-white text-brand-charcoal p-8 lg:p-10 shadow-card ring-1 ring-brand-hairline hover:ring-brand-red/30 transition-all">
                <div className="flex items-center gap-3 mb-6">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-red text-white text-sm font-black">
                        {String(index).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.24em] text-brand-grey">{stage}</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-black mb-1">{name}</h3>
                {swahili && (
                    <p className="text-sm text-brand-grey mb-2">
                        <em className="not-italic font-bold text-brand-charcoal">{swahili}</em>
                    </p>
                )}
                <p className="text-sm text-brand-red font-bold mb-4">{duration}</p>
                <p className="text-brand-grey leading-relaxed flex-1">{description}</p>
                {exit && (
                    <div className="mt-6 pt-6 border-t border-brand-hairline">
                        <p className="eyebrow mb-2">Exit</p>
                        <p className="text-sm font-bold text-brand-charcoal leading-snug">{exit}</p>
                    </div>
                )}
            </div>
        </StaggerItem>
    );
}

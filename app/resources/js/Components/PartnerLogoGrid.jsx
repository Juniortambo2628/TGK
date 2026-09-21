import { Reveal, Stagger, StaggerItem } from './Motion';

export default function PartnerLogoGrid({ partners }) {
    return (
        <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-10 items-center">
            {partners.map((p) => (
                <StaggerItem key={p.name} className="flex items-center justify-center">
                    {p.url ? (
                        <a href={p.url} target="_blank" rel="noopener" aria-label={p.name}
                           className="group block p-4 opacity-80 hover:opacity-100 transition-opacity">
                            <img
                                src={p.logo}
                                alt={p.name}
                                loading="lazy"
                                className="h-14 lg:h-16 w-auto object-contain grayscale group-hover:grayscale-0 transition duration-300"
                            />
                        </a>
                    ) : (
                        <div className="group p-4 opacity-80 hover:opacity-100 transition-opacity">
                            <img
                                src={p.logo}
                                alt={p.name}
                                loading="lazy"
                                className="h-14 lg:h-16 w-auto object-contain grayscale group-hover:grayscale-0 transition duration-300"
                            />
                        </div>
                    )}
                </StaggerItem>
            ))}
        </Stagger>
    );
}

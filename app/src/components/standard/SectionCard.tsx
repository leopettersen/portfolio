import type { ReactNode } from 'react';

export interface SectionCardProps {
    tag: string;
    title1: string;
    title2: string;
    description: string;
    sticky?: boolean;
    className?: string;
    children?: ReactNode;
}

export function SectionCard({ tag, title1, title2, description, sticky = false, className = '', children }: SectionCardProps) {
    return (
        <div className={`${sticky ? 'xl:sticky xl:top-32' : ''} self-start flex flex-col gap-2 rounded-2xl border border-line bg-surface/95 p-5 shadow-brand backdrop-blur-xl ${className}`}>
            <p className="self-start flex items-center gap-2 rounded-2xl border border-brand bg-brand/10 px-2 py-1 text-xs font-semibold text-brand">
                <span className="h-2 w-2 rounded-full bg-brand" />
                {tag}
            </p>

            <h2 className="mt-2 text-4xl font-bold text-title">{title1}</h2>
            <h2 className="text-4xl font-bold text-brand">{title2}</h2>

            <p className="mt-4 text-sm">{description}</p>

            {children}
        </div>
    );
}

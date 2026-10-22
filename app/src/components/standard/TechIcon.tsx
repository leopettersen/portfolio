export interface TechIconProps {
    src: string;
}

export function TechIcon({ src }: TechIconProps) {
    const mask = `url("${src}") center / contain no-repeat`;

    return (
        <span
            aria-hidden="true"
            className="inline-block size-[1em] shrink-0 bg-current"
            style={{ mask, WebkitMask: mask }}
        />
    );
}

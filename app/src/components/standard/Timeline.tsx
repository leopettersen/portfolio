import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';

const TRIGGER = 0.6;

function useOnScroll(ref: RefObject<HTMLDivElement | null>, onUpdate: (rect: DOMRect) => void) {
    const onUpdateRef = useRef(onUpdate);

    useEffect(() => {
        onUpdateRef.current = onUpdate;
    });

    useEffect(() => {
        let frame = 0;

        const update = () => {
            if (ref.current) onUpdateRef.current(ref.current.getBoundingClientRect());
        };

        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [ref]);
}

export function Timeline({ children }: { children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useOnScroll(ref, (rect) => {
        setHeight(Math.max(0, Math.min(rect.height, window.innerHeight * TRIGGER - rect.top)));
    });

    return (
        <div ref={ref} className="relative ms-3 flex min-w-0 flex-1 flex-col gap-10 pl-8 lg:ms-12 lg:pl-10">
            <div className="absolute left-0 top-0 h-full w-px bg-line" />
            <div
                className="absolute left-0 top-0 w-px bg-brand shadow-[0_0_12px_var(--brand)]"
                style={{ height }}
            />
            {children}
        </div>
    );
}

export function TimelineItem({ children }: { children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);

    useOnScroll(ref, (rect) => {
        setActive(rect.top + 24 <= window.innerHeight * TRIGGER);
    });

    return (
        <div ref={ref} className="relative">
            <span
                className={`absolute -left-[2.4rem] top-6 z-10 size-3 rounded-full border-2 transition-all duration-300 motion-reduce:transition-none lg:-left-[2.9rem] ${
                    active
                        ? 'scale-125 border-brand bg-brand shadow-[0_0_14px_var(--brand)]'
                        : 'border-line bg-surface'
                }`}
            />
            <div className={`transition-all duration-500 motion-reduce:transition-none ${active ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-40 motion-reduce:translate-y-0'}`}>
                {children}
            </div>
        </div>
    );
}

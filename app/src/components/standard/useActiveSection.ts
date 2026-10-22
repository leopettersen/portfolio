import { useEffect, useState } from 'react';

const TRIGGER = 0.4;

export function useActiveSection(ids: readonly string[]) {
    const [active, setActive] = useState<string | null>(null);

    useEffect(() => {
        let frame = 0;

        const update = () => {
            const sections = ids
                .map((id) => document.getElementById(id))
                .filter((element): element is HTMLElement => element !== null)
                .map((element) => ({ id: element.id, top: element.getBoundingClientRect().top }))
                .sort((a, b) => a.top - b.top);

            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
            const visible = atBottom ? sections : sections.filter((section) => section.top <= window.innerHeight * TRIGGER);

            setActive(visible.at(-1)?.id ?? null);
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
    }, [ids]);

    return active;
}

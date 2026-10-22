import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface CrashScreenProps {
    error: Error;
    onRestart: () => void;
    onStandard: () => void;
}

function stopCode(error: Error) {
    const words = error.message
        .normalize('NFD')
        .replace(/[^a-zA-Z\s]/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 5);

    return (words.length > 0 ? words.join('_') : error.name).toUpperCase();
}

function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function CrashScreen({ error, onRestart, onStandard }: CrashScreenProps) {
    const { t } = useTranslation();
    const [progress, setProgress] = useState(() => (reducedMotion() ? 100 : 0));

    useEffect(() => {
        if (progress >= 100) return;

        const timer = setTimeout(() => setProgress((current) => Math.min(100, current + 20)), 400);
        return () => clearTimeout(timer);
    }, [progress]);

    return (
        <div role="alert" className="fixed inset-0 z-[70] flex flex-col justify-center overflow-auto bg-[#0067c0] px-6 py-10 font-sans text-white md:px-[12vw]">
            <p className="text-8xl font-light md:text-9xl" aria-hidden="true">:(</p>

            <h1 className="mt-8 max-w-3xl text-2xl font-light leading-snug md:text-3xl">
                {t('crash.title')}
            </h1>

            <p className="mt-6 text-xl font-light">{t('crash.progress', { percent: progress })}</p>

            <div className="mt-10 max-w-3xl space-y-2 text-sm md:text-base">
                <p>{t('crash.stopCode')}: <span className="font-mono font-semibold">{stopCode(error)}</span></p>
                <p className="break-words font-mono text-white/80">{t('crash.failed')}: {error.message || error.name}</p>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <button
                    type="button"
                    autoFocus
                    onClick={(event) => {
                        event.stopPropagation();
                        onRestart();
                    }}
                    className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[#0067c0] hover:bg-white/90 transition-colors"
                >
                    {t('crash.restart')}
                </button>
                <button
                    type="button"
                    onClick={onStandard}
                    className="rounded-md border border-white/70 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                    {t('crash.standard')}
                </button>
            </div>
        </div>
    );
}

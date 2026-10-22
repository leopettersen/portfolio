import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BootScreenProps {
    onFinish: () => void;
}

export function BootScreen({ onFinish }: BootScreenProps) {
    const { t } = useTranslation();

    const [visibleCount, setVisibleCount] = useState(0);
    const [fading, setFading] = useState(false);

    const bootLines = t('boot.lines', { returnObjects: true }) as string[];

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            onFinish();
        }
    }, [onFinish]);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        if (visibleCount < bootLines.length) {
            const timer = setTimeout(() => {
                setVisibleCount((count) => count + 1);
            }, 300);

            return () => {
                clearTimeout(timer);
            };
        }

        const fadeTimer = setTimeout(() => {
            setFading(true);
        }, 700);

        return () => {
            clearTimeout(fadeTimer);
        };
    }, [visibleCount, onFinish, bootLines.length]);

    useEffect(() => {
        if (!fading) return;

        const finishTimer = setTimeout(() => {
            onFinish();
        }, 500);

        return () => {
            clearTimeout(finishTimer);
        };
    }, [fading, onFinish]);

    useEffect(() => {
        const handleSkip = () => {
            onFinish();
        };

        window.addEventListener('keydown', handleSkip);
        window.addEventListener('click', handleSkip);

        return () => {
            window.removeEventListener('keydown', handleSkip);
            window.removeEventListener('click', handleSkip);
        };
    }, [onFinish]);

    const progress = (visibleCount / bootLines.length) * 100;

    return (
        <div role="status" className={`fixed inset-0 z-50 bg-slate-950 text-zinc-100 font-mono p-6 md:p-16 flex flex-col justify-between overflow-hidden ${fading ? 'opacity-0 transition-opacity duration-500' : ''}`}>

            <div className="flex flex-col gap-2 text-sm md:text-base">
                {bootLines.slice(0, visibleCount).map((line, index) => (
                    <p key={index} className="flex gap-3">
                        <span className="text-green-400 shrink-0">
                            [ OK ]
                        </span>

                        <span>
                            {line}
                        </span>
                    </p>
                ))}

                <span className="text-blue-500 animate-pulse">
                    █
                </span>
            </div>

            <div className="flex flex-col gap-4">

                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>

                <p className="text-xs text-slate-400">
                    {t('boot.skip')}
                </p>

            </div>

        </div>
    );
}
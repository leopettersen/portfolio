import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoaderCircle, Power } from 'lucide-react';

export type PowerAction = 'restart' | 'shutdown';

interface PowerScreenProps {
    action: PowerAction;
    onBoot: () => void;
}

const LEAVING_DURATION = 1500;

function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function PowerScreen({ action, onBoot }: PowerScreenProps) {
    const { t } = useTranslation();
    const [off, setOff] = useState(() => action === 'shutdown' && reducedMotion());

    useEffect(() => {
        if (off) return;

        const timer = setTimeout(() => {
            if (action === 'restart') onBoot();
            else setOff(true);
        }, reducedMotion() ? 0 : LEAVING_DURATION);

        return () => {
            clearTimeout(timer);
        };
    }, [action, off, onBoot]);

    if (off) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-black p-6 text-center font-mono text-zinc-100">
                <p role="status" className="text-base md:text-lg text-amber-400">
                    {t('power.safe')}
                </p>

                <button
                    type="button"
                    autoFocus
                    onClick={(event) => {
                        event.stopPropagation();
                        onBoot();
                    }}
                    aria-label={t('power.turnOn')}
                    title={t('power.turnOn')}
                    className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:border-blue-500 hover:text-blue-500 focus-visible:border-blue-500 focus-visible:text-blue-500 focus-visible:outline-none transition-colors"
                >
                    <Power size={24} />
                </button>
            </div>
        );
    }

    return (
        <div role="status" className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-slate-950 font-mono text-zinc-100">
            <LoaderCircle size={32} className="text-blue-500 motion-safe:animate-spin" aria-hidden="true" />
            <p className="text-sm md:text-base">
                {action === 'restart' ? t('power.restarting') : t('power.shuttingDown')}
            </p>
        </div>
    );
}

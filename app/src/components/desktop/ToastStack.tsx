import { useTranslation } from 'react-i18next';
import { AppWindow, Hand, Keyboard, Link, TriangleAlert, Wifi, WifiOff, X, type LucideIcon } from 'lucide-react';
import type { ToastItem, ToastKind } from '../../types';

const toastIcons: Record<ToastKind, LucideIcon> = {
    welcome: Hand,
    windows: AppWindow,
    shortcuts: Keyboard,
    offline: WifiOff,
    online: Wifi,
    linkCopied: Link,
    copyFailed: TriangleAlert,
};

export interface ToastStackProps {
    toasts: ToastItem[];
    onDismiss: (id: number) => void;
}

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
    const { t, i18n } = useTranslation();
    const isMobile = !window.matchMedia('(min-width: 768px)').matches;

    function toastText(kind: ToastKind) {
        const mobileKey = `toasts.${kind}.mobile`;
        return isMobile && i18n.exists(mobileKey) ? t(mobileKey) : t(`toasts.${kind}.text`);
    }

    return (
        <ol
            aria-live="polite"
            aria-label={t('toasts.region')}
            className="pointer-events-none absolute bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-2 right-2 z-50 flex flex-col gap-2 font-mono md:left-auto md:w-96"
        >
            {toasts.map(({ id, kind }) => {
                const Icon = toastIcons[kind];

                return (
                    <li
                        key={id}
                        className="group pointer-events-auto relative overflow-hidden rounded-lg border border-slate-700/60 bg-slate-900/95 shadow-2xl shadow-black/60 backdrop-blur-md motion-safe:animate-toast-in"
                    >
                        <div className="flex gap-3 p-4 pr-11">
                            <Icon size={20} className={`mt-0.5 shrink-0 ${kind === 'offline' || kind === 'copyFailed' ? 'text-red-400' : 'text-blue-500'}`} aria-hidden="true" />

                            <div className="min-w-0">
                                <p className="text-sm font-bold text-zinc-100">{t(`toasts.${kind}.title`)}</p>
                                <p className="mt-1 text-sm leading-relaxed text-slate-400">{toastText(kind)}</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => onDismiss(id)}
                            aria-label={t('toasts.dismiss')}
                            title={t('toasts.dismiss')}
                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <span
                            aria-hidden="true"
                            onAnimationEnd={() => onDismiss(id)}
                            className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-blue-500/70 animate-toast-timer group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
                        />
                    </li>
                );
            })}
        </ol>
    );
}

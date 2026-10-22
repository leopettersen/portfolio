import { useTranslation } from 'react-i18next';
import { RotateCcw, TriangleAlert, X } from 'lucide-react';

export interface WindowCrashProps {
    error: Error;
    onRetry: () => void;
    onClose: () => void;
}

export function WindowCrash({ error, onRetry, onClose }: WindowCrashProps) {
    const { t } = useTranslation();

    return (
        <div role="alert" className="flex flex-col items-start gap-4 py-6">
            <TriangleAlert size={32} className="text-yellow-500" aria-hidden="true" />
            <h2 className="text-xl font-bold">{t('crash.appTitle')}</h2>
            <p className="text-base text-slate-400">{t('crash.appText')}</p>
            <p className="break-words font-mono text-sm text-slate-500">{error.message || error.name}</p>

            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={onRetry}
                    className="flex items-center gap-2 rounded-md border border-slate-700/60 px-3 py-2 text-sm text-slate-300 hover:border-slate-500 hover:text-white transition-colors"
                >
                    <RotateCcw size={16} />
                    {t('crash.retry')}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-2 rounded-md border border-slate-700/60 px-3 py-2 text-sm text-slate-300 hover:border-red-500 hover:text-white transition-colors"
                >
                    <X size={16} />
                    {t('window.close')}
                </button>
            </div>
        </div>
    );
}

import { useTranslation } from 'react-i18next';

import { Clock } from './Clock';
import { SquareTerminal } from 'lucide-react';

export function TopBar() {
    const { i18n } = useTranslation();
    const isEnglish = i18n.resolvedLanguage === 'en';

    return (
        <div className="w-full h-12 bg-slate-950 border-b border-slate-800/60 flex items-center justify-between gap-3 px-3 sm:px-4 text-base sm:text-lg text-zinc-400 font-mono">

            <div className="flex items-center gap-2 min-w-0 whitespace-nowrap">
                <i className="text-blue-600">
                    <SquareTerminal size={20} />
                </i>

                <span className="text-zinc-100 font-bold">
                    LP
                </span>

                <span className="mx-1 sm:mx-2">
                    /
                </span>

                <span className="sm:hidden truncate">L. Pettersen</span>
                <span className="hidden sm:inline">Leonardo Pettersen</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">

                <button
                    type="button"
                    onClick={() => i18n.changeLanguage(isEnglish ? 'pt' : 'en')}
                    aria-label={isEnglish ? 'Mudar para português' : 'Switch to English'}
                    title={isEnglish ? 'Mudar para português' : 'Switch to English'}
                    className="flex items-center gap-2 rounded-full border border-slate-700/60 px-3 py-0.5 hover:border-slate-500 transition-colors cursor-pointer"
                >
                    <span className={isEnglish ? 'text-zinc-500' : 'text-blue-500 font-bold'}>
                        PT
                    </span>

                    <span className="text-zinc-700" aria-hidden="true">
                        |
                    </span>

                    <span className={isEnglish ? 'text-blue-500 font-bold' : 'text-zinc-500'}>
                        EN
                    </span>
                </button>

                <Clock />

            </div>

        </div>
    );
}
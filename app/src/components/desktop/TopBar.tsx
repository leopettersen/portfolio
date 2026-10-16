import { useTranslation } from 'react-i18next';

import { Clock } from './Clock';
import { SquareTerminal } from 'lucide-react';

export function TopBar() {
    const { i18n } = useTranslation();

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

                <div className="flex gap-2">

                    <button
                        onClick={() => i18n.changeLanguage('pt')}
                        className={i18n.resolvedLanguage === 'pt' ? 'text-zinc-100 cursor-pointer' : 'text-zinc-500 cursor-pointer'}
                    >
                        PT
                    </button>

                    <span className="text-zinc-700">
                        |
                    </span>

                    <button
                        onClick={() => i18n.changeLanguage('en')}
                        className={i18n.resolvedLanguage === 'en' ? 'text-zinc-100 cursor-pointer' : 'text-zinc-500 cursor-pointer'}
                    >
                        EN
                    </button>

                </div>

                <Clock />

            </div>

        </div>
    );
}
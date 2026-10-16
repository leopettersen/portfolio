import { Clock } from './Clock';
import { SquareTerminal } from 'lucide-react';
import { LanguageToggle } from '../ui/LanguageToggle';

export function TopBar() {
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

                <LanguageToggle />

                <Clock />

            </div>

        </div>
    );
}

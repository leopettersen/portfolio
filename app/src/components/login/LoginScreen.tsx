import { useTranslation } from 'react-i18next';
import { LayoutTemplate, Monitor, User, type LucideIcon } from 'lucide-react';
import type { PortfolioMode } from '../../types';
import { LanguageToggle } from '../ui/LanguageToggle';

interface LoginScreenProps {
    onEnter: (mode: PortfolioMode) => void;
}

const modes: { mode: PortfolioMode; icon: LucideIcon }[] = [
    { mode: 'system', icon: Monitor },
    { mode: 'standard', icon: LayoutTemplate },
];

export function LoginScreen({ onEnter }: LoginScreenProps) {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 font-mono">
            <div className="absolute top-4 right-4 text-sm">
                <LanguageToggle />
            </div>

            <div className="flex min-h-full flex-col items-center justify-center gap-6 px-4 py-16">
                <div className="h-28 w-28 rounded-full bg-slate-700/60 flex items-center justify-center">
                    <User size={56} aria-hidden color="white"/>
                </div>

                <h1 className="text-2xl font-semibold text-zinc-100">
                    Guest
                </h1>

                <p className="text-center text-sm text-slate-400">
                    {t('login.question')}
                </p>

                <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
                    {modes.map(({ mode, icon: Icon }, index) => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => onEnter(mode)}
                            autoFocus={index === 0}
                            className="flex flex-1 flex-col items-start gap-2 rounded-md border border-slate-700/60 p-4 text-left hover:border-slate-500 hover:bg-slate-800/60 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                        >
                            <span className="flex items-center gap-2 text-zinc-100">
                                <Icon size={18} className="text-blue-500" />
                                {t(`login.${mode}.title`)}
                            </span>
                            <span className="text-xs text-slate-400">
                                {t(`login.${mode}.description`)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

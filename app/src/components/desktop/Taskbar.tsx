import { useTranslation } from 'react-i18next';
import type { Language, OpenWindow, WindowId } from '../../types';
import { appInfo } from '../../data/apps';
import { LanguageToggle } from '../ui/LanguageToggle';
import { Clock } from './Clock';
import { SystemTray } from './SystemTray';

export interface TaskbarProps {
    windows: OpenWindow[];
    focusedWindow: WindowId | null;
    startOpen: boolean;
    onStartToggle: () => void;
    onWindowClick: (id: WindowId) => void;
}

export function Taskbar({ windows, focusedWindow, startOpen, onStartToggle, onWindowClick }: TaskbarProps) {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage as Language;

    return (
        <footer className="relative z-40 flex h-12 shrink-0 items-center gap-2 border-t border-slate-800/60 bg-slate-950/95 px-2 font-mono text-zinc-400 backdrop-blur-md pb-[env(safe-area-inset-bottom)] box-content">
            <div className="hidden flex-1 md:block" />

            <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex-none">
                <button
                    type="button"
                    data-start-button
                    onClick={onStartToggle}
                    aria-label={t('taskbar.start')}
                    aria-expanded={startOpen}
                    title={t('taskbar.start')}
                    className={`flex h-10 w-11 shrink-0 items-center justify-center rounded-md transition-colors cursor-pointer ${startOpen ? 'bg-slate-800' : 'hover:bg-slate-800/80'}`}
                >
                    <img src="/images/logo.png" alt="" className="h-6 w-6 rounded-sm" />
                </button>

                {windows.map(({ id, minimized }) => {
                    const { title, icon: Icon } = appInfo(id, language);
                    const focused = id === focusedWindow && !minimized;

                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => onWindowClick(id)}
                            aria-label={title}
                            aria-pressed={focused}
                            title={title}
                            className={`relative flex h-10 w-11 shrink-0 items-center justify-center rounded-md transition-colors cursor-pointer ${focused ? 'bg-slate-800/80' : 'hover:bg-slate-800/60'}`}
                        >
                            <Icon size={20} className={focused ? 'text-blue-400' : 'text-slate-300'} />
                            <span className={`absolute bottom-0.5 h-[3px] rounded-full transition-all ${focused ? 'w-4 bg-blue-500' : 'w-1.5 bg-slate-500'}`} />
                        </button>
                    );
                })}
            </nav>

            <div className="flex shrink-0 items-center justify-end gap-3 text-sm md:flex-1">
                <SystemTray />
                <LanguageToggle />
                <Clock />
            </div>
        </footer>
    );
}

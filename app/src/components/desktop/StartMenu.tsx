import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, LogOut, Search, Sparkles, SquareChevronRight, type LucideIcon } from 'lucide-react';
import type { WindowId } from '../../types';
import { sections } from '../../data/sections';
import { appInfo } from '../../data/apps';
import { systemCommands } from '../../data/commands';

export interface StartMenuProps {
    onOpen: (id: WindowId) => void;
    onCommand: (command: string) => void;
    onAskAgent: (question: string) => void;
    onSwitchMode: () => void;
    onClose: () => void;
}

interface SearchResult {
    key: string;
    icon: LucideIcon;
    label: string;
    detail: string;
    run: () => void;
}

const apps: WindowId[] = ['terminal', ...sections.map((section) => section.id)];

function normalize(text: string) {
    return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function StartMenu({ onOpen, onCommand, onAskAgent, onSwitchMode, onClose }: StartMenuProps) {
    const { t } = useTranslation();
    const menuRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            if (menuRef.current?.contains(target) || target.closest('[data-start-button]')) return;
            onClose();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    function appName(id: WindowId) {
        return id === 'terminal' ? 'terminal' : t(`standard.menu.${id}`);
    }

    const term = normalize(query);
    const results: SearchResult[] = [];

    if (term) {
        for (const id of apps) {
            const { label, icon } = appInfo(id);
            if ([label, appName(id)].some((name) => normalize(name).includes(term))) {
                results.push({ key: `app-${id}`, icon, label, detail: appName(id), run: () => onOpen(id) });
            }
        }

        for (const command of systemCommands) {
            if (command.includes(term)) {
                results.push({
                    key: `command-${command}`,
                    icon: SquareChevronRight,
                    label: command,
                    detail: t(`commands.${command}`),
                    run: () => onCommand(command),
                });
            }
        }

        if (results.length === 0) {
            results.push({
                key: 'agent',
                icon: Sparkles,
                label: t('taskbar.askAgent'),
                detail: query.trim(),
                run: () => onAskAgent(query.trim()),
            });
        }
    }

    const current = Math.min(selected, Math.max(results.length - 1, 0));

    function handleSearchKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelected((current + 1) % Math.max(results.length, 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelected((current - 1 + results.length) % Math.max(results.length, 1));
        } else if (event.key === 'Enter') {
            results[current]?.run();
        }
    }

    return (
        <div
            ref={menuRef}
            role="dialog"
            aria-label={t('taskbar.start')}
            className="absolute bottom-14 left-1/2 z-50 flex w-[min(34rem,calc(100%-1rem))] -translate-x-1/2 flex-col overflow-hidden rounded-lg border border-slate-800/60 bg-slate-900/95 font-mono text-zinc-100 shadow-2xl shadow-black/60 backdrop-blur-md"
        >
            <div className="flex items-center gap-3 border-b border-slate-800/60 p-4">
                <img src="/images/logo.png" alt="" className="h-10 w-10 shrink-0 rounded-md" />
                <div className="min-w-0">
                    <p className="font-bold">Leonardo Pettersen</p>
                    <p className="truncate text-sm text-slate-400">{t('terminal.role')}</p>
                </div>
            </div>

            <div className="px-4 pt-4">
                <label className="flex items-center gap-2 rounded-md border border-slate-700/60 bg-slate-800/60 px-3 py-2 focus-within:border-blue-500">
                    <Search size={16} className="shrink-0 text-slate-400" aria-hidden="true" />
                    <input
                        type="text"
                        autoFocus={!window.matchMedia('(pointer: coarse)').matches}
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setSelected(0);
                        }}
                        onKeyDown={handleSearchKeyDown}
                        placeholder={t('taskbar.searchPlaceholder')}
                        aria-label={t('taskbar.searchPlaceholder')}
                        className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none"
                    />
                </label>
            </div>

            <div className="p-4">
                {term ? (
                    <ul className="flex flex-col gap-1" role="listbox" aria-label={t('taskbar.searchPlaceholder')}>
                        {results.map((result, index) => (
                            <li key={result.key} role="option" aria-selected={index === current}>
                                <button
                                    type="button"
                                    onClick={result.run}
                                    onMouseEnter={() => setSelected(index)}
                                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors cursor-pointer ${index === current ? 'bg-slate-800 text-white' : 'text-slate-300'}`}
                                >
                                    <result.icon size={18} className="shrink-0 text-blue-500" />
                                    <span className="shrink-0">{result.label}</span>
                                    <span className="min-w-0 truncate text-slate-400">{result.detail}</span>
                                    <ChevronRight size={16} className="ml-auto shrink-0 text-slate-500" aria-hidden="true" />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <>
                        <p className="mb-3 text-xs uppercase tracking-wide text-slate-400">{t('taskbar.apps')}</p>

                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {apps.map((id) => {
                                const { label, icon: Icon } = appInfo(id);

                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => onOpen(id)}
                                        className="flex flex-col items-center gap-2 rounded-md px-2 py-3 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer"
                                    >
                                        <Icon size={22} className="text-blue-500" />
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            <div className="flex justify-end border-t border-slate-800/60 bg-slate-950/60 px-4 py-2">
                <button
                    type="button"
                    onClick={onSwitchMode}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors cursor-pointer"
                >
                    <LogOut size={16} />
                    {t('taskbar.switchMode')}
                </button>
            </div>
        </div>
    );
}

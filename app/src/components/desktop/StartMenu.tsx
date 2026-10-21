import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import type { WindowId } from '../../types';
import { sections } from '../../data/sections';
import { appInfo } from '../../data/apps';

export interface StartMenuProps {
    onOpen: (id: WindowId) => void;
    onSwitchMode: () => void;
    onClose: () => void;
}

const apps: WindowId[] = ['terminal', ...sections.map((section) => section.id)];

export function StartMenu({ onOpen, onSwitchMode, onClose }: StartMenuProps) {
    const { t } = useTranslation();
    const menuRef = useRef<HTMLDivElement>(null);

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

            <div className="p-4">
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

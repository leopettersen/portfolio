import { useRef, useState, type ReactNode } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { ArrowLeft, Copy, Minus, Square, X, type LucideIcon } from 'lucide-react';
import { CommandPrompt } from '../terminal/CommandPrompt';
import { useDraggable } from '../../hooks/useDraggable';

export interface WindowProps {
    title: string;
    icon: LucideIcon;
    children: ReactNode;
    onClose: () => void;
    onMinimize: () => void;
    onCommand: (command: string) => void;
    showFooter?: boolean;
    active?: boolean;
    onFocus?: () => void;
    initialOffset?: number;
}

const controlButton = 'flex h-10 w-12 items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors cursor-pointer';

export function Window({ title, icon: Icon, children, onClose, onMinimize, onCommand, showFooter = true, active = true, onFocus, initialOffset = 0 }: WindowProps) {
  const { t } = useTranslation();
  const [isMaximized, setIsMaximized] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  const dragEnabled = !isMaximized && isDesktop;
  const { position, onPointerDown, onPointerMove, onPointerUp, onPointerCancel } = useDraggable(dragEnabled, rootRef, { x: initialOffset, y: initialOffset });

  return (
    <div
      ref={rootRef}
      onPointerDownCapture={onFocus}
      className={`pointer-events-auto shadow-2xl shadow-black/50 bg-slate-900 md:border border-slate-800/60 flex flex-col text-zinc-100 text-base md:text-lg font-mono overflow-hidden ${
        isMaximized
          ? 'absolute inset-0 w-full h-full max-h-none rounded-none'
          : 'w-full md:w-5/6 lg:w-[60%] h-full md:h-auto md:max-h-[calc(100%-2rem)] md:rounded-lg'
      }`}
      style={isMaximized || !isDesktop ? undefined : { transform: `translate(${position.x}px, ${position.y}px)`, maxHeight: `calc(100% - 2rem - ${2 * initialOffset}px)` }}
    >

      <div
        className={`flex h-10 shrink-0 items-center bg-slate-950 border-b border-slate-800/60 select-none${dragEnabled ? ' cursor-move' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >

        <button
          onClick={onClose}
          className="md:hidden flex h-full items-center gap-1 px-3 text-sm text-slate-300 hover:text-white transition-colors"
          aria-label={t('window.back')}
        >
          <ArrowLeft size={16} />
          {t('window.back')}
        </button>

        <span className={`flex min-w-0 flex-1 items-center gap-2 text-sm md:px-4 ${active ? 'text-slate-200' : 'text-slate-400'}`}>
          <Icon size={16} className={`hidden shrink-0 md:block ${active ? 'text-blue-500' : ''}`} aria-hidden="true" />
          <span className="truncate" data-window-title>{title}</span>
        </span>

        <div className="flex shrink-0">
            <button className={controlButton} onClick={onMinimize} aria-label={t('window.minimize')} title={t('window.minimize')}>
              <Minus size={16} />
            </button>
            <button
              className={`${controlButton} hidden md:flex`}
              onClick={() => setIsMaximized(prev => !prev)}
              aria-label={isMaximized ? t('window.restore') : t('window.maximize')}
              title={isMaximized ? t('window.restore') : t('window.maximize')}
            >
              {isMaximized ? <Copy size={14} /> : <Square size={14} />}
            </button>
            <button
              className={`${controlButton} hidden md:flex hover:bg-red-600 hover:text-white`}
              onClick={onClose}
              aria-label={t('window.close')}
              title={t('window.close')}
            >
              <X size={18} />
            </button>
        </div>

      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        {children}
      </div>
      {showFooter && (
        <div className="shrink-0 hidden md:flex justify-between items-center px-4 py-3 bg-slate-950 border-t border-slate-800/60">
          <CommandPrompt onSubmit={onCommand} active={active} />

          <p className="text-xs text-slate-400 hidden sm:block">
            <Trans i18nKey="window.closeHint" values={{ command: 'close' }} components={{ 1: <span className="text-slate-400" /> }} />
          </p>
        </div>
      )}
    </div>
  );
}

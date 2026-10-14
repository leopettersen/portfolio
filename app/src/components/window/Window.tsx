import { useRef, useState, type ReactNode } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { CommandPrompt } from '../terminal/CommandPrompt';
import { useDraggable } from '../../hooks/useDraggable';

export interface WindowProps {
    title: string;
    children: ReactNode;
    onClose: () => void;
    onCommand: (command: string) => void;
    showFooter?: boolean;
}

export function Window({ title, children, onClose, onCommand, showFooter = true }: WindowProps) {
  const { t } = useTranslation();
  const [isMaximized, setIsMaximized] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dragEnabled = !isMaximized && window.matchMedia('(min-width: 768px)').matches;
  const { position, onPointerDown, onPointerMove, onPointerUp, onPointerCancel } = useDraggable(dragEnabled, rootRef);

  return (
    <div
      ref={rootRef}
      className={`pointer-events-auto shadow-2xl shadow-black/50 bg-slate-900 border border-slate-800/60 flex flex-col text-zinc-100 text-lg font-mono overflow-hidden ${
        isMaximized
          ? 'absolute inset-0 w-full h-full max-h-none rounded-none'
          : 'w-full md:w-5/6 lg:w-[60%] h-full md:h-auto md:max-h-[calc(100dvh-6rem)] rounded-lg'
      }`}
      style={isMaximized ? undefined : { transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      
      <div
        className={`relative flex items-center px-4 py-3 bg-slate-950 border-b border-slate-800/60 rounded-t-lg select-none${dragEnabled ? ' cursor-move' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        
        <button
          onClick={onClose}
          className="md:hidden flex items-center gap-1 -ml-2 px-2 py-1 text-sm text-slate-300 hover:text-white transition-colors"
          aria-label={t('window.back')}
        >
          <ArrowLeft size={16} />
          {t('window.back')}
        </button>

        <div className="hidden md:flex gap-2">
            <button className="w-3 h-3 rounded-full bg-red-500 cursor-pointer" onClick={onClose} aria-label={t('window.close')} />
            <button className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer" onClick={onClose} aria-label={t('window.minimize')} />
            <button
              className="w-3 h-3 rounded-full bg-green-500 cursor-pointer"
              onClick={() => setIsMaximized(prev => !prev)}
              aria-label={isMaximized ? t('window.restore') : t('window.maximize')}
            />
        </div>
        
        <span className="absolute left-1/2 -translate-x-1/2 text-sm text-slate-400">
          {title}
        </span>

      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        {children}
      </div>
      {showFooter && (
        <div className="shrink-0 hidden md:flex justify-between items-center px-4 py-3 bg-slate-950 border-t border-slate-800/60 rounded-b-lg">
          <CommandPrompt onSubmit={onCommand} />

          <p className="text-xs text-slate-500 hidden sm:block">
            <Trans i18nKey="window.closeHint" values={{ command: 'close' }} components={{ 1: <span className="text-slate-400" /> }} />
          </p>
        </div>
      )}
    </div>
  );
}
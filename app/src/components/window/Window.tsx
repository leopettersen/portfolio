import { useCallback, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { ArrowLeft, Copy, Minus, Square, X, type LucideIcon } from 'lucide-react';
import { CommandPrompt } from '../terminal/CommandPrompt';
import { ContextMenu } from '../desktop/ContextMenu';
import { systemCommandNames } from '../../data/commands';
import type { Language, Point, WindowLayout, WindowLeave } from '../../types';
import { useDraggable } from '../../hooks/useDraggable';
import { resizeEdges, useResizable, type ResizeEdge, type Size } from '../../hooks/useResizable';

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
    leaving?: WindowLeave;
    initialLayout?: WindowLayout;
    onLayoutChange?: (layout: WindowLayout) => void;
    commandHistory?: string[];
    scrollBody?: boolean;
    overlay?: ReactNode;
}

const edgeClasses: Record<ResizeEdge, string> = {
    n: 'top-0 inset-x-3 h-1.5 cursor-ns-resize',
    s: 'bottom-0 inset-x-3 h-1.5 cursor-ns-resize',
    e: 'right-0 inset-y-3 w-1.5 cursor-ew-resize',
    w: 'left-0 inset-y-3 w-1.5 cursor-ew-resize',
    ne: 'top-0 right-0 h-3 w-3 cursor-nesw-resize',
    nw: 'top-0 left-0 h-3 w-3 cursor-nwse-resize',
    se: 'bottom-0 right-0 h-3 w-3 cursor-nwse-resize',
    sw: 'bottom-0 left-0 h-3 w-3 cursor-nesw-resize',
};

const leaveAnimations: Record<WindowLeave, string> = {
    close: 'motion-safe:animate-window-out',
    minimize: 'motion-safe:animate-window-minimize',
};

const controlButton = 'flex h-10 w-12 items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors cursor-pointer';

export function Window({ title, icon: Icon, children, onClose, onMinimize, onCommand, showFooter = true, active = true, onFocus, initialOffset = 0, leaving, initialLayout, onLayoutChange, commandHistory, scrollBody = true, overlay }: WindowProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage as Language;
  const [isMaximized, setIsMaximized] = useState(initialLayout?.maximized ?? false);
  const [menu, setMenu] = useState<Point | null>(null);
  const closeMenu = useCallback(() => setMenu(null), []);
  const rootRef = useRef<HTMLDivElement>(null);
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  const dragEnabled = !isMaximized && isDesktop;
  const initialPosition = initialLayout ? { x: initialLayout.x, y: initialLayout.y } : { x: initialOffset, y: initialOffset };
  const initialSize = initialLayout?.width && initialLayout.height ? { width: initialLayout.width, height: initialLayout.height } : null;

  function reportLayout(nextPosition: Point, nextSize: Size | null, maximized: boolean) {
    onLayoutChange?.({ ...nextPosition, ...nextSize, maximized });
  }

  const { position, setPosition, onPointerDown, onPointerMove, onPointerUp, onPointerCancel } = useDraggable(
    dragEnabled,
    rootRef,
    initialPosition,
    handleDragEnd,
  );
  const { size, handleProps } = useResizable(
    dragEnabled,
    rootRef,
    position,
    setPosition,
    initialSize,
    (nextSize, nextPosition) => reportLayout(nextPosition, nextSize, false),
  );

  function handleDragEnd(nextPosition: Point) {
    reportLayout(nextPosition, size, false);
  }

  function toggleMaximized() {
    setIsMaximized(!isMaximized);
    reportLayout(position, size, !isMaximized);
  }

  function handleTitleContextMenu(event: MouseEvent<HTMLDivElement>) {
    if (!isDesktop) return;
    event.preventDefault();
    event.stopPropagation();

    const rect = event.currentTarget.getBoundingClientRect();
    const fromKeyboard = event.clientX === 0 && event.clientY === 0;
    setMenu(fromKeyboard ? { x: rect.left + 16, y: rect.bottom } : { x: event.clientX, y: event.clientY });
  }

  function handleTitleDoubleClick(event: MouseEvent<HTMLDivElement>) {
    if (!isDesktop) return;
    if (event.target instanceof Element && event.target.closest('button')) return;
    toggleMaximized();
  }

  const freeStyle = size
    ? { transform: `translate(${position.x}px, ${position.y}px)`, width: size.width, height: size.height, maxWidth: '100%', maxHeight: '100%' }
    : { transform: `translate(${position.x}px, ${position.y}px)`, maxHeight: `calc(100% - 2rem - ${2 * Math.abs(initialPosition.y)}px)` };

  return (
    <div
      ref={rootRef}
      onPointerDownCapture={onFocus}
      className={`${leaving ? `pointer-events-none ${leaveAnimations[leaving]}` : 'pointer-events-auto motion-safe:animate-window-in'} shadow-2xl shadow-black/50 bg-slate-900 md:border border-slate-800/60 flex flex-col text-zinc-100 text-base md:text-lg font-mono overflow-hidden ${
        isMaximized
          ? 'absolute inset-0 w-full h-full max-h-none rounded-none'
          : 'relative w-full md:w-5/6 lg:w-[60%] h-full md:h-auto md:max-h-[calc(100%-2rem)] md:rounded-lg'
      }`}
      style={isMaximized || !isDesktop ? undefined : freeStyle}
    >
      {dragEnabled && resizeEdges.map((edge) => (
        <div key={edge} aria-hidden="true" className={`absolute z-10 touch-none ${edgeClasses[edge]}`} {...handleProps(edge)} />
      ))}

      <div
        className={`flex h-10 shrink-0 items-center bg-slate-950 border-b border-slate-800/60 select-none${dragEnabled ? ' cursor-move' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onDoubleClick={handleTitleDoubleClick}
        onContextMenu={handleTitleContextMenu}
        data-window-titlebar
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
              onClick={toggleMaximized}
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
      <div className={`flex-1 min-h-0 p-4 md:p-8 ${scrollBody ? 'overflow-y-auto custom-scrollbar' : 'flex flex-col overflow-hidden'}`}>
        {children}
      </div>
      {showFooter && (
        <div className="shrink-0 hidden md:flex justify-between items-center px-4 py-3 bg-slate-950 border-t border-slate-800/60">
          <CommandPrompt onSubmit={onCommand} active={active} commandHistory={commandHistory} />

          <p className="text-xs text-slate-400 hidden sm:block">
            <Trans i18nKey="window.closeHint" values={{ command: systemCommandNames.close[language] }} components={{ 1: <span className="text-slate-400" /> }} />
          </p>
        </div>
      )}
      {overlay}
      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          label={t('contextMenu.window')}
          onClose={closeMenu}
          items={[
            { key: 'maximize', label: isMaximized ? t('window.restore') : t('window.maximize'), icon: isMaximized ? Copy : Square, run: toggleMaximized },
            { key: 'minimize', label: t('window.minimize'), icon: Minus, run: onMinimize },
            { key: 'close', label: t('window.close'), icon: X, run: onClose, danger: true, separatorBefore: true },
          ]}
        />
      )}
    </div>
  );
}

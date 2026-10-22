import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import type { LucideIcon } from 'lucide-react';

export interface ContextMenuItem {
    key: string;
    label: string;
    icon: LucideIcon;
    run: () => void;
    danger?: boolean;
    separatorBefore?: boolean;
}

export interface ContextMenuProps {
    x: number;
    y: number;
    label: string;
    items: ContextMenuItem[];
    onClose: () => void;
}

const MARGIN = 8;

export function ContextMenu({ x, y, label, items, onClose }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [previous] = useState(() => (document.activeElement instanceof HTMLElement ? document.activeElement : null));

    useLayoutEffect(() => {
        const menu = menuRef.current;
        if (!menu) return;

        const { width, height } = menu.getBoundingClientRect();
        menu.style.left = `${Math.max(MARGIN, Math.min(x, window.innerWidth - width - MARGIN))}px`;
        menu.style.top = `${Math.max(MARGIN, Math.min(y, window.innerHeight - height - MARGIN))}px`;
        menu.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus({ preventScroll: true });
    }, [x, y]);

    useEffect(() => {
        return () => {
            if (previous?.isConnected && (!document.activeElement || document.activeElement === document.body)) previous.focus({ preventScroll: true });
        };
    }, [previous]);

    useEffect(() => {
        const handlePointerDown = (event: PointerEvent) => {
            if (event.target instanceof Node && menuRef.current?.contains(event.target)) return;
            onClose();
        };

        document.addEventListener('pointerdown', handlePointerDown, { capture: true });
        window.addEventListener('blur', onClose);
        window.addEventListener('resize', onClose);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown, { capture: true });
            window.removeEventListener('blur', onClose);
            window.removeEventListener('resize', onClose);
        };
    }, [onClose]);

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        const buttons = [...(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])];
        const index = buttons.indexOf(document.activeElement as HTMLButtonElement);

        if (event.key === 'Escape' || event.key === 'Tab') {
            event.preventDefault();
            onClose();
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            buttons[(index + 1) % buttons.length]?.focus();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            buttons[(index - 1 + buttons.length) % buttons.length]?.focus();
        } else if (event.key === 'Home') {
            event.preventDefault();
            buttons[0]?.focus();
        } else if (event.key === 'End') {
            event.preventDefault();
            buttons[buttons.length - 1]?.focus();
        }
    }

    return createPortal(
        <div
            ref={menuRef}
            role="menu"
            aria-label={label}
            onKeyDown={handleKeyDown}
            onContextMenu={(event) => event.preventDefault()}
            style={{ left: x, top: y }}
            className="fixed z-[60] flex w-max min-w-56 flex-col rounded-md border border-slate-700/60 bg-slate-900/95 p-1 font-mono text-sm text-slate-300 shadow-2xl shadow-black/60 backdrop-blur-md"
        >
            {items.map((item) => (
                <div key={item.key} role="none" className="flex flex-col">
                    {item.separatorBefore && <div role="separator" className="mx-2 my-1 h-px bg-slate-700/60" />}
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                            onClose();
                            item.run();
                        }}
                        className={`flex items-center gap-3 rounded px-3 py-1.5 text-left transition-colors focus:outline-none ${item.danger ? 'hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white' : 'hover:bg-slate-800 hover:text-white focus:bg-slate-800 focus:text-white'}`}
                    >
                        <item.icon size={16} className="shrink-0" aria-hidden="true" />
                        {item.label}
                    </button>
                </div>
            ))}
        </div>,
        document.body,
    );
}

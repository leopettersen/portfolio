import { useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { Point } from '../../types';
import { useDraggable } from '../../hooks/useDraggable';

export interface DesktopIconProps {
    icon: LucideIcon;
    label: string;
    onOpen: () => void;
    initialPosition?: Point;
    onMove?: (position: Point) => void;
}

export function DesktopIcon({ icon: Icon, label, onOpen, initialPosition, onMove }: DesktopIconProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dragEnabled = window.matchMedia('(min-width: 768px)').matches;
    const { position, moved, onPointerDown, onPointerMove, onPointerUp, onPointerCancel } = useDraggable(dragEnabled, buttonRef, initialPosition, onMove);

    function handleClick() {
        if (moved.current) return;
        onOpen();
    }

    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            className="flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-colors group cursor-pointer select-none"
        >
            <div className="shadow-md shadow-black/40 w-12 h-12 flex items-center justify-center border border-white/5 rounded-lg group-hover:border-slate-500 transition-colors">
                <Icon size={20} />
            </div>

            <span className="text-sm font-mono lowercase tracking-wide">
                {label}
            </span>
        </button>
    );
}

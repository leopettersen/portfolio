import { useRef, useState } from 'react';
import type { PointerEvent, RefObject } from 'react';

export type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export const resizeEdges: ResizeEdge[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

export interface Size {
    width: number;
    height: number;
}

interface Position {
    x: number;
    y: number;
}

interface ResizeStart {
    pointerId: number;
    edge: ResizeEdge;
    x: number;
    y: number;
    position: Position;
    rect: DOMRect;
    bounds: DOMRect;
}

const MIN_WIDTH = 420;
const MIN_HEIGHT = 280;

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export function useResizable(
    enabled: boolean,
    targetRef: RefObject<HTMLElement | null>,
    position: Position,
    setPosition: (position: Position) => void,
) {
    const [size, setSize] = useState<Size | null>(null);
    const resizeStart = useRef<ResizeStart | null>(null);

    function onPointerDown(edge: ResizeEdge) {
        return (event: PointerEvent<HTMLElement>) => {
            const element = targetRef.current;
            if (!enabled || !element || event.button !== 0) return;

            event.preventDefault();

            resizeStart.current = {
                pointerId: event.pointerId,
                edge,
                x: event.clientX,
                y: event.clientY,
                position,
                rect: element.getBoundingClientRect(),
                bounds: (element.closest('main') ?? document.documentElement).getBoundingClientRect(),
            };
            event.currentTarget.setPointerCapture(event.pointerId);
        };
    }

    function onPointerMove(event: PointerEvent<HTMLElement>) {
        const start = resizeStart.current;
        if (!start || start.pointerId !== event.pointerId) return;

        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        let { left, top, right, bottom } = start.rect;

        if (start.edge.includes('w')) left = clamp(left + dx, start.bounds.left, right - MIN_WIDTH);
        if (start.edge.includes('e')) right = clamp(right + dx, left + MIN_WIDTH, start.bounds.right);
        if (start.edge.includes('n')) top = clamp(top + dy, start.bounds.top, bottom - MIN_HEIGHT);
        if (start.edge.includes('s')) bottom = clamp(bottom + dy, top + MIN_HEIGHT, start.bounds.bottom);

        const width = right - left;
        const height = bottom - top;
        const centeredLeft = start.rect.left - start.position.x + (start.rect.width - width) / 2;
        const centeredTop = start.rect.top - start.position.y + (start.rect.height - height) / 2;

        setSize({ width, height });
        setPosition({ x: left - centeredLeft, y: top - centeredTop });
    }

    function onPointerEnd() {
        resizeStart.current = null;
    }

    function handleProps(edge: ResizeEdge) {
        return {
            onPointerDown: onPointerDown(edge),
            onPointerMove,
            onPointerUp: onPointerEnd,
            onPointerCancel: onPointerEnd,
        };
    }

    return { size, handleProps };
}

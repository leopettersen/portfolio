import { useRef, useState } from 'react';
import type { PointerEvent, RefObject } from 'react';
import type { Point } from '../types';

export type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export const resizeEdges: ResizeEdge[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

export interface Size {
    width: number;
    height: number;
}

interface ResizeStart {
    pointerId: number;
    edge: ResizeEdge;
    x: number;
    y: number;
    position: Point;
    rect: DOMRect;
    bounds: DOMRect;
    last: { size: Size; position: Point } | null;
}

const MIN_WIDTH = 420;
const MIN_HEIGHT = 280;

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export function useResizable(
    enabled: boolean,
    targetRef: RefObject<HTMLElement | null>,
    position: Point,
    setPosition: (position: Point) => void,
    initialSize: Size | null = null,
    onResizeEnd?: (size: Size, position: Point) => void,
) {
    const [size, setSize] = useState<Size | null>(initialSize);
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
                last: null,
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

        const next = { size: { width, height }, position: { x: left - centeredLeft, y: top - centeredTop } };
        start.last = next;
        setSize(next.size);
        setPosition(next.position);
    }

    function onPointerEnd() {
        const last = resizeStart.current?.last;
        resizeStart.current = null;
        if (last) onResizeEnd?.(last.size, last.position);
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

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent, RefObject } from 'react';
import type { Point } from '../types';

interface DragStart {
    pointerId: number;
    x: number;
    y: number;
    positionX: number;
    positionY: number;
    rect: DOMRect;
    bounds: DOMRect;
    last: Point | null;
}

function boundsOf(element: HTMLElement) {
    return (element.closest('main') ?? document.documentElement).getBoundingClientRect();
}

function shiftInto(start: number, end: number, min: number, max: number) {
    if (end - start > max - min) return min - start;
    if (start < min) return min - start;
    if (end > max) return max - end;
    return 0;
}

export function useDraggable(
    enabled: boolean,
    targetRef: RefObject<HTMLElement | null>,
    initialPosition: Point = { x: 0, y: 0 },
    onDragEnd?: (position: Point) => void,
) {
    const [position, setPosition] = useState(initialPosition);
    const dragStart = useRef<DragStart | null>(null);
    const moved = useRef(false);

    useEffect(() => {
        if (!enabled) return;

        const keepInView = () => {
            const element = targetRef.current;
            if (!element || element.offsetWidth === 0) return;

            const rect = element.getBoundingClientRect();
            const bounds = boundsOf(element);
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const halfWidth = element.offsetWidth / 2;
            const halfHeight = element.offsetHeight / 2;

            const dx = shiftInto(centerX - halfWidth, centerX + halfWidth, bounds.left, bounds.right);
            const dy = shiftInto(centerY - halfHeight, centerY + halfHeight, bounds.top, bounds.bottom);

            if (dx !== 0 || dy !== 0) setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        };

        const frame = requestAnimationFrame(keepInView);
        window.addEventListener('resize', keepInView);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', keepInView);
        };
    }, [enabled, targetRef]);

    function onPointerDown(event: PointerEvent<HTMLElement>) {
        if (!enabled) return;
        if (event.button !== 0) return;

        const target = event.target;
        const button = target instanceof Element ? target.closest('button') : null;
        if (button && button !== event.currentTarget) return;

        const element = targetRef.current ?? event.currentTarget;

        dragStart.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            positionX: position.x,
            positionY: position.y,
            rect: element.getBoundingClientRect(),
            bounds: boundsOf(element),
            last: null,
        };
        moved.current = false;
    }

    function onPointerMove(event: PointerEvent<HTMLElement>) {
        const start = dragStart.current;
        if (!start || start.pointerId !== event.pointerId) return;

        if (event.buttons === 0) {
            dragStart.current = null;
            return;
        }

        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;

        if (!moved.current) {
            if (Math.hypot(dx, dy) <= 4) return;
            moved.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
        }

        let x = start.positionX + dx;
        let y = start.positionY + dy;

        const minX = start.positionX - (start.rect.left - start.bounds.left);
        const maxX = minX + start.bounds.width - start.rect.width;
        const minY = start.positionY - (start.rect.top - start.bounds.top);
        const maxY = minY + start.bounds.height - start.rect.height;

        x = Math.max(Math.min(x, maxX), minX);
        y = Math.max(Math.min(y, maxY), minY);

        start.last = { x, y };
        setPosition({ x, y });
    }

    function onPointerUp() {
        const last = dragStart.current?.last;
        dragStart.current = null;
        if (last && moved.current) onDragEnd?.(last);
    }

    function onPointerCancel() {
        onPointerUp();
    }

    return {
        position,
        setPosition,
        moved,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel
    };
}

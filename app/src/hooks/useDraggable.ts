import { useRef, useState } from 'react';
import type { PointerEvent, RefObject } from 'react';

interface DragStart {
    pointerId: number;
    x: number;
    y: number;
    positionX: number;
    positionY: number;
    rect: DOMRect;
    bounds: DOMRect;
}

export function useDraggable(enabled: boolean, targetRef?: RefObject<HTMLElement | null>, initialPosition = { x: 0, y: 0 }) {
    const [position, setPosition] = useState(initialPosition);
    const dragStart = useRef<DragStart | null>(null);
    const moved = useRef(false);

    function onPointerDown(event: PointerEvent<HTMLElement>) {
        if (!enabled) return;
        if (event.button !== 0) return;

        const target = event.target;
        const button = target instanceof Element ? target.closest('button') : null;
        if (button && button !== event.currentTarget) return;

        const element = targetRef?.current ?? event.currentTarget;

        dragStart.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            positionX: position.x,
            positionY: position.y,
            rect: element.getBoundingClientRect(),
            bounds: (element.closest('main') ?? document.documentElement).getBoundingClientRect()
        };
        moved.current = false;
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function onPointerMove(event: PointerEvent<HTMLElement>) {
        const start = dragStart.current;
        if (!start || start.pointerId !== event.pointerId) return;

        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.hypot(dx, dy) > 4) moved.current = true;

        let x = start.positionX + dx;
        let y = start.positionY + dy;

        const minX = start.positionX - (start.rect.left - start.bounds.left);
        const maxX = minX + start.bounds.width - start.rect.width;
        const minY = start.positionY - (start.rect.top - start.bounds.top);
        const maxY = minY + start.bounds.height - start.rect.height;

        x = Math.max(Math.min(x, maxX), minX);
        y = Math.max(Math.min(y, maxY), minY);

        setPosition({ x, y });
    }

    function onPointerUp() {
        dragStart.current = null;
    }

    function onPointerCancel() {
        dragStart.current = null;
    }

    return {
        position,
        moved,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel
    };
}

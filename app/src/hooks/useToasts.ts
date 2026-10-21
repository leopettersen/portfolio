import { useCallback, useRef, useState } from 'react';
import type { ToastItem, ToastKind } from '../types';

const MAX_TOASTS = 3;

export function useToasts() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const nextId = useRef(1);

    const push = useCallback((kind: ToastKind, replaces: ToastKind[] = []) => {
        const id = nextId.current++;
        const removed = [kind, ...replaces];

        setToasts((prev) => [...prev.filter((toast) => !removed.includes(toast.kind)), { id, kind }].slice(-MAX_TOASTS));
    }, []);

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return { toasts, push, dismiss };
}

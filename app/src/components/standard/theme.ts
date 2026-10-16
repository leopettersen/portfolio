import { useSyncExternalStore } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'standard-theme';
const listeners = new Set<() => void>();

function initialTheme(): Theme {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'dark' || saved === 'light') return saved;
    } catch {
    }

    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

let current: Theme = initialTheme();

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function setTheme(theme: Theme) {
    current = theme;

    try {
        localStorage.setItem(STORAGE_KEY, theme);
    } catch {
    }

    listeners.forEach((listener) => listener());
}

export function useTheme() {
    return useSyncExternalStore(subscribe, () => current);
}

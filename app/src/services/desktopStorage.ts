import type { Point, WindowId, WindowLayout } from '../types';
import { sections } from '../data/sections';

const STORAGE_KEY = 'desktop-state';
const VERSION = 1;

export interface SavedWindow {
    id: WindowId;
    minimized: boolean;
}

export interface DesktopState {
    unlocked: boolean;
    icons: Partial<Record<WindowId, Point>>;
    layouts: Partial<Record<WindowId, WindowLayout>>;
    windows: SavedWindow[];
}

const windowIds: WindowId[] = ['terminal', ...sections.map((section) => section.id)];

function emptyState(): DesktopState {
    return { unlocked: false, icons: {}, layouts: {}, windows: [] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value);
}

function isWindowId(value: unknown): value is WindowId {
    return windowIds.includes(value as WindowId);
}

function readPoint(value: unknown): Point | null {
    return isRecord(value) && isNumber(value.x) && isNumber(value.y) ? { x: value.x, y: value.y } : null;
}

function readLayout(value: unknown): WindowLayout | null {
    const point = readPoint(value);
    if (!point || !isRecord(value)) return null;

    const layout: WindowLayout = { ...point, maximized: value.maximized === true };
    if (isNumber(value.width) && isNumber(value.height)) {
        layout.width = value.width;
        layout.height = value.height;
    }

    return layout;
}

function readEntries<T>(value: unknown, read: (item: unknown) => T | null) {
    const result: Partial<Record<WindowId, T>> = {};
    if (!isRecord(value)) return result;

    for (const [id, item] of Object.entries(value)) {
        const parsed = read(item);
        if (isWindowId(id) && parsed) result[id] = parsed;
    }

    return result;
}

function readWindows(value: unknown) {
    if (!Array.isArray(value)) return [];

    const result: SavedWindow[] = [];
    for (const item of value) {
        if (isRecord(item) && isWindowId(item.id) && !result.some((saved) => saved.id === item.id)) {
            result.push({ id: item.id, minimized: item.minimized === true });
        }
    }

    return result;
}

export function loadDesktopState(): DesktopState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return emptyState();

        const data: unknown = JSON.parse(raw);
        if (!isRecord(data) || data.version !== VERSION) return emptyState();

        return {
            unlocked: data.unlocked === true,
            icons: readEntries(data.icons, readPoint),
            layouts: readEntries(data.layouts, readLayout),
            windows: readWindows(data.windows),
        };
    } catch {
        return emptyState();
    }
}

export function saveDesktopState(state: DesktopState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, ...state }));
    } catch {
    }
}

import { SquareTerminal, type LucideIcon } from 'lucide-react';
import type { WindowId } from '../types';
import { sections } from './sections';

export const terminalApp = {
    label: 'terminal',
    title: 'terminal — zsh',
    icon: SquareTerminal
};

export interface AppInfo {
    label: string;
    title: string;
    icon: LucideIcon;
}

export function appInfo(id: WindowId): AppInfo {
    const section = sections.find((item) => item.id === id);

    return section
        ? { label: section.command, title: section.windowTitle, icon: section.icon }
        : terminalApp;
}

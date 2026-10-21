import { SquareTerminal, type LucideIcon } from 'lucide-react';
import type { Language, WindowId } from '../types';
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
    aliases: string[];
}

export function appInfo(id: WindowId, language: Language): AppInfo {
    const section = sections.find((item) => item.id === id);

    return section
        ? { label: section.command[language], title: section.windowTitle[language], icon: section.icon, aliases: Object.values(section.command) }
        : { ...terminalApp, aliases: [terminalApp.label] };
}

import type { Localized, SectionId } from '../types';
import { sections } from './sections';

export const systemCommands = ['help', 'clear', 'close', 'logout'] as const;

export type SystemCommand = typeof systemCommands[number];

export const systemCommandNames: Record<SystemCommand, Localized> = {
    help: { pt: 'ajuda', en: 'help' },
    clear: { pt: 'limpar', en: 'clear' },
    close: { pt: 'fechar', en: 'close' },
    logout: { pt: 'sair', en: 'logout' },
};

const extraAliases: Partial<Record<SystemCommand, string[]>> = {
    logout: ['exit'],
};

export type ResolvedCommand =
    | { kind: 'section'; id: SectionId }
    | { kind: 'system'; id: SystemCommand };

export function normalizeCommand(text: string) {
    return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function commandAliases(id: SystemCommand) {
    return [...Object.values(systemCommandNames[id]), ...(extraAliases[id] ?? [])];
}

export function resolveCommand(input: string): ResolvedCommand | null {
    const command = normalizeCommand(input);

    const section = sections.find((item) => Object.values(item.command).includes(command));
    if (section) return { kind: 'section', id: section.id };

    const system = systemCommands.find((id) => commandAliases(id).includes(command));
    return system ? { kind: 'system', id: system } : null;
}

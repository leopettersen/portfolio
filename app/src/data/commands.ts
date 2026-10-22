import type { Language, Localized, SectionId, TerminalOutput } from '../types';
import { sections } from './sections';

export const systemCommands = ['help', 'ask', 'clear', 'close', 'logout', 'lang', 'resume', 'neofetch', 'reboot', 'shutdown'] as const;

export const hiddenCommands = ['matrix'] as const;

export type SystemCommand = typeof systemCommands[number] | typeof hiddenCommands[number];

export const systemCommandNames: Record<SystemCommand, Localized> = {
    help: { pt: 'ajuda', en: 'help' },
    ask: { pt: 'perguntar', en: 'ask' },
    clear: { pt: 'limpar', en: 'clear' },
    close: { pt: 'fechar', en: 'close' },
    logout: { pt: 'sair', en: 'logout' },
    lang: { pt: 'idioma', en: 'lang' },
    resume: { pt: 'curriculo', en: 'resume' },
    neofetch: { pt: 'neofetch', en: 'neofetch' },
    reboot: { pt: 'reiniciar', en: 'reboot' },
    shutdown: { pt: 'desligar', en: 'shutdown' },
    matrix: { pt: 'matrix', en: 'matrix' },
};

const extraAliases: Partial<Record<SystemCommand, string[]>> = {
    logout: ['exit'],
};

export type ResolvedCommand =
    | { kind: 'section'; id: SectionId; args: string[] }
    | { kind: 'system'; id: SystemCommand; args: string[] };

export function normalizeCommand(text: string) {
    return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function commandAliases(id: SystemCommand) {
    return [...Object.values(systemCommandNames[id]), ...(extraAliases[id] ?? [])];
}

export function visibleCommandNames(language: Language) {
    return [
        ...sections.map((section) => section.command[language]),
        ...systemCommands.map((id) => systemCommandNames[id][language]),
    ];
}

export function neofetchOutput(): TerminalOutput {
    return {
        type: 'neofetch',
        uptimeMinutes: Math.floor(performance.now() / 60000),
        resolution: `${window.screen.width}x${window.screen.height}`,
    };
}

export function resolveCommand(input: string): ResolvedCommand | null {
    const [name = '', ...args] = input.trim().split(/\s+/);
    const command = normalizeCommand(name);

    const section = sections.find((item) => Object.values(item.command).includes(command));
    if (section) return { kind: 'section', id: section.id, args };

    const system = [...systemCommands, ...hiddenCommands].find((id) => commandAliases(id).includes(command));
    return system ? { kind: 'system', id: system, args } : null;
}

export const systemCommands = ['help', 'clear', 'close', 'logout'] as const;

export type SystemCommand = typeof systemCommands[number];

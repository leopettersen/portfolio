import { version as reactVersion } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language, TerminalAnswer, TerminalOutput } from '../../types';
import { MarkdownText } from '../ui/MarkdownText';
import { sections } from '../../data/sections';
import { systemCommandNames, systemCommands } from '../../data/commands';

const logo = [
    ' _      ____  ',
    '| |    |  _ \\ ',
    '| |    | |_) |',
    '| |    |  __/ ',
    '| |___ | |    ',
    '|_____||_|    ',
].join('\n');

const colorBlocks = ['bg-slate-950', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-cyan-500', 'bg-slate-200'];

function HelpOutput() {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage as Language;

    const rows = [
        ...sections.map((section) => ({ name: section.command[language], description: t(`commands.${section.id}`) })),
        ...systemCommands.map((id) => ({ name: systemCommandNames[id][language], description: t(`commands.${id}`) })),
    ];

    return (
        <div>
            <p>{t('terminal.availableCommands')}</p>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                {rows.map((row) => (
                    <div key={row.name} className="contents">
                        <dt className="text-slate-200">{row.name}</dt>
                        <dd>{row.description}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

function NeofetchOutput({ uptimeMinutes, resolution }: { uptimeMinutes: number; resolution: string }) {
    const { t } = useTranslation();

    const rows = [
        [t('terminal.neofetch.os'), t('terminal.neofetch.osValue')],
        [t('terminal.neofetch.host'), 'leopettersen.dev'],
        [t('terminal.neofetch.kernel'), `React ${reactVersion}`],
        [t('terminal.neofetch.shell'), t('terminal.neofetch.shellValue')],
        [t('terminal.neofetch.uptime'), t('terminal.neofetch.uptimeValue', { count: uptimeMinutes })],
        [t('terminal.neofetch.resolution'), resolution],
        [t('terminal.neofetch.font'), 'JetBrains Mono'],
        [t('terminal.neofetch.stack'), 'TypeScript · Vite · Tailwind CSS'],
        [t('terminal.neofetch.languages'), t('terminal.neofetch.languagesValue')],
    ];

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
            <pre className="shrink-0 font-mono text-sm leading-tight text-blue-500" aria-hidden="true">{logo}</pre>

            <div className="min-w-0">
                <p className="text-slate-200"><span className="text-blue-500">guest</span>@<span className="text-blue-500">leopettersen.dev</span></p>
                <p aria-hidden="true">{'-'.repeat(21)}</p>
                <dl>
                    {rows.map(([label, value]) => (
                        <div key={label} className="flex gap-2">
                            <dt className="shrink-0 text-blue-500">{label}:</dt>
                            <dd className="min-w-0 break-words">{value}</dd>
                        </div>
                    ))}
                </dl>
                <div className="mt-3 flex" aria-hidden="true">
                    {colorBlocks.map((color) => (
                        <span key={color} className={`h-4 w-6 ${color}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function AgentOutput({ answer }: { answer?: TerminalAnswer }) {
    const { t } = useTranslation();
    if (!answer) return null;

    return (
        <div className="flex flex-col gap-1">
            <span className="text-blue-500">leonardo@agent</span>

            {answer.errorCode ? (
                <p className="text-red-400">
                    {t(`agent.errors.${answer.errorCode}`, { defaultValue: t('agent.errors.generic'), seconds: answer.retryAfter ?? 60 })}
                </p>
            ) : (
                <div className="flex flex-col gap-2 break-words">
                    {answer.text && <MarkdownText text={answer.text} />}
                    {answer.streaming && <span className="inline-block h-4 w-2 bg-blue-500 animate-pulse" aria-label={t('agent.typing')} />}
                    {answer.stopped && <span className="text-sm">{t('agent.stopped')}</span>}
                </div>
            )}
        </div>
    );
}

export interface HistoryOutputProps {
    output: TerminalOutput;
    answers: Record<number, TerminalAnswer>;
}

export function HistoryOutput({ output, answers }: HistoryOutputProps) {
    if (output.type === 'help') return <HelpOutput />;
    if (output.type === 'agent') return <AgentOutput answer={answers[output.requestId]} />;
    if (output.type === 'neofetch') return <NeofetchOutput uptimeMinutes={output.uptimeMinutes} resolution={output.resolution} />;

    return <div className="whitespace-pre-line">{output.text}</div>;
}

import { useRef, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { GitFork } from 'lucide-react';
import type { Language, Point } from '../../types';
import { localeMap } from '../../i18n/localeMap';
import { useDraggable } from '../../hooks/useDraggable';
import { useGithubSummary } from '../../hooks/useGithubSummary';

const languageColors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Java: '#b07219',
    Python: '#3572a5',
    HTML: '#e34c26',
    CSS: '#663399',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#8d00b1',
    Shell: '#89e051',
};

const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 365 * 24 * 60],
    ['month', 30 * 24 * 60],
    ['day', 24 * 60],
    ['hour', 60],
    ['minute', 1],
];

function relativeTime(date: string, locale: string) {
    const minutes = Math.round((new Date(date).getTime() - Date.now()) / 60000);
    const [unit, size] = units.find(([, length]) => Math.abs(minutes) >= length) ?? ['minute', 1];
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(Math.round(minutes / size), unit);
}

function colorOf(language: string | null) {
    return (language && languageColors[language]) ?? '#64748b';
}

export interface GithubWidgetProps {
    initialPosition?: Point;
    onMove?: (position: Point) => void;
}

export function GithubWidget({ initialPosition, onMove }: GithubWidgetProps) {
    const { t, i18n } = useTranslation();
    const locale = localeMap[i18n.resolvedLanguage as Language];
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const summary = useGithubSummary(isDesktop);
    const widgetRef = useRef<HTMLElement>(null);
    const { position, moved, onPointerDown, onPointerMove, onPointerUp, onPointerCancel } = useDraggable(isDesktop && !!summary, widgetRef, initialPosition, onMove);

    function blockClickAfterDrag(event: MouseEvent<HTMLElement>) {
        if (!moved.current) return;
        event.preventDefault();
        event.stopPropagation();
    }

    if (!isDesktop || !summary) return null;

    return (
        <section
            ref={widgetRef}
            aria-label={t('github.title')}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onClickCapture={blockClickAfterDrag}
            onDragStart={(event) => event.preventDefault()}
            style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
            className="absolute right-4 top-4 flex w-72 cursor-move select-none flex-col gap-4 rounded-lg border border-slate-800/60 bg-slate-900/80 p-4 font-mono text-sm text-slate-300 shadow-xl shadow-black/40 backdrop-blur-md"
        >
            <a href={summary.profileUrl} target="_blank" rel="noreferrer" title={t('github.openProfile')} className="flex items-center gap-3 rounded-md hover:text-white">
                <img src={summary.avatarUrl} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full border border-slate-700" />
                <span className="min-w-0">
                    <span className="block truncate font-bold text-zinc-100">{summary.name}</span>
                    <span className="block truncate text-xs text-blue-400">@{summary.login}</span>
                </span>
            </a>

            <p className="text-xs text-slate-400">
                {t('github.repos', { count: summary.publicRepos })} · {t('github.followers', { count: summary.followers })}
            </p>

            {summary.recent.length > 0 && (
                <div>
                    <h2 className="mb-2 text-xs uppercase tracking-wide text-slate-400">{t('github.recent')}</h2>
                    <ul className="flex flex-col gap-1.5">
                        {summary.recent.map((repo) => (
                            <li key={repo.name}>
                                <a href={repo.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded hover:text-white">
                                    <GitFork size={14} className="shrink-0 text-slate-500" aria-hidden="true" />
                                    <span className="min-w-0 flex-1 truncate">{repo.name}</span>
                                    <span className="shrink-0 text-xs text-slate-500">{relativeTime(repo.pushedAt, locale)}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {summary.languages.length > 0 && (
                <div>
                    <h2 className="mb-2 text-xs uppercase tracking-wide text-slate-400">{t('github.languages')}</h2>
                    <div className="flex h-2 overflow-hidden rounded-full bg-slate-800" aria-hidden="true">
                        {summary.languages.map((language) => (
                            <span key={language.name} style={{ width: `${language.percent}%`, backgroundColor: colorOf(language.name) }} />
                        ))}
                    </div>
                    <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        {summary.languages.map((language) => (
                            <li key={language.name} className="flex items-center gap-1.5">
                                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: colorOf(language.name) }} aria-hidden="true" />
                                <span className="truncate">{language.name}</span>
                                <span className="text-slate-500">{language.percent}%</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}

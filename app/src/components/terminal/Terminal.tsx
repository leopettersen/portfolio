import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { HistoryEntry, Language, WindowLayout, WindowLeave } from '../../types';
import { CommandPrompt } from './CommandPrompt';
import { sections } from '../../data/sections';
import { Window } from '../window/Window';
import { terminalApp } from '../../data/apps';
import { systemCommandNames } from '../../data/commands';

export interface TerminalProps {
  history: HistoryEntry[];
  onCommand: (command: string) => void;
  onClose: () => void;
  onMinimize: () => void;
  active?: boolean;
  onFocus?: () => void;
  initialOffset?: number;
  leaving?: WindowLeave;
  initialLayout?: WindowLayout;
  onLayoutChange?: (layout: WindowLayout) => void;
}

export function Terminal({ history, onCommand, onClose, onMinimize, active = true, onFocus, initialOffset, leaving, initialLayout, onLayoutChange }: TerminalProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage as Language;
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const historyElement = historyRef.current;
    if (!historyElement) return;

    const lastEntry = historyElement.querySelector('[data-history-entry]:last-child');
    if (lastEntry) {
      lastEntry.scrollIntoView({ block: 'end', behavior: 'smooth'})
    }
  }, [history]);

  const chipSections = sections.filter(section => section.showChip);

  return (
    <Window title={terminalApp.title} icon={terminalApp.icon} onClose={onClose} onMinimize={onMinimize} onCommand={onCommand} showFooter={false} active={active} onFocus={onFocus} initialOffset={initialOffset} leaving={leaving} initialLayout={initialLayout} onLayoutChange={onLayoutChange}>
      <div className="h-full flex flex-col min-h-0">

        <div className="shrink-0">
          <h1 className="text-lg font-bold">
            Leonardo Pettersen
          </h1>

          <p className="font-medium text-slate-300">
            {t('terminal.role')}
          </p>

          <p className="text-slate-400">
            {t('terminal.university')}
          </p>

          <p className="text-slate-400 mt-6">
            {t('terminal.typeMessage')}{' '}
            <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
              {t('terminal.typeCommand')}
            </span>{' '}
            {t('terminal.toSeeCommands')}
          </p>

          <div className="flex flex-wrap gap-4 mt-3">
            {chipSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => onCommand(section.command[language])}
                className="border border-slate-700/50 px-3 py-2 md:py-1 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors cursor-pointer"
              >
                [ {section.command[language]} ]
              </button>
            ))}
            <button
              type="button"
              onClick={() => onCommand(systemCommandNames.help[language])}
              className="border border-slate-700/50 px-3 py-2 md:py-1 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors"
            >
              [ {systemCommandNames.help[language]} ]
            </button>
          </div>
        </div>

        <div ref={historyRef} className="flex-1 min-h-0 overflow-y-auto mt-8 pr-2">
          <div role="log" aria-live="polite" className="flex flex-col gap-3">
            {history.map((entry, index) => (
              <div key={index}>
                <div>
                  <span className="text-blue-500">guest@os:~$</span>{' '}
                  <span className="text-slate-200">{entry.command}</span>
                </div>
                <div className="text-slate-400 mt-1 whitespace-pre-line">
                  {entry.output}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 mt-6 pt-6 border-t border-slate-800/60">
          <CommandPrompt onSubmit={onCommand} active={active} />
        </div>

      </div>
    </Window>
  );
}

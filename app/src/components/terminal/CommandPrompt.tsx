import { useRef, useState, useEffect, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '../../types';
import { visibleCommandNames } from '../../data/commands';

export interface CommandPromptProps {
    onSubmit: (command: string) => void;
    active?: boolean;
    commandHistory?: string[];
}

function commonPrefix(values: string[]) {
    return values.reduce((prefix, value) => {
        let length = 0;
        while (length < prefix.length && prefix[length] === value[length]) length++;
        return prefix.slice(0, length);
    });
}

export function CommandPrompt({ onSubmit, active = true, commandHistory = [] }: CommandPromptProps) {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage as Language;
    const [inputValue, setInputValue] = useState('');
    const [caret, setCaret] = useState(0);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const [draft, setDraft] = useState('');
    const [hint, setHint] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [isTouch] = useState(() => window.matchMedia('(pointer: coarse)').matches);

    function updateValue(value: string) {
        setInputValue(value);
        setCaret(value.length);
        setHint('');
        requestAnimationFrame(() => {
            const input = inputRef.current;
            if (input && input.value === value) input.setSelectionRange(value.length, value.length);
        });
    }

    function browseHistory(direction: -1 | 1) {
        if (commandHistory.length === 0) return;

        if (historyIndex === null) {
            if (direction === 1) return;
            setDraft(inputValue);
            setHistoryIndex(commandHistory.length - 1);
            updateValue(commandHistory[commandHistory.length - 1]);
            return;
        }

        const next = historyIndex + direction;
        if (next >= commandHistory.length) {
            setHistoryIndex(null);
            updateValue(draft);
        } else {
            const index = Math.max(next, 0);
            setHistoryIndex(index);
            updateValue(commandHistory[index]);
        }
    }

    function completionFor(value: string) {
        const typed = value.trimStart();
        if (!typed || typed.includes(' ')) return null;

        const prefix = typed.toLowerCase();
        const matches = [...new Set(visibleCommandNames(language))].filter((name) => name.startsWith(prefix));

        return { prefix, matches };
    }

    function complete() {
        const completion = completionFor(inputValue);
        if (!completion) return;

        const { prefix, matches } = completion;

        if (matches.length === 1) {
            updateValue(`${matches[0]} `);
        } else if (matches.length > 1) {
            const shared = commonPrefix(matches);
            if (shared.length > prefix.length) updateValue(shared);
            else setHint(matches.join('  '));
        }
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            onSubmit(inputValue);
            setHistoryIndex(null);
            updateValue('');
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            browseHistory(-1);
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            browseHistory(1);
        } else if (event.key === 'Tab' && inputValue.trim()) {
            event.preventDefault();
            complete();
        }
    }

    function handleClick() {
        inputRef.current?.focus({ preventScroll: true });
    }

    useEffect(() => {
        if (active && !isTouch) {
            inputRef.current?.focus({ preventScroll: true });
        }
    }, [active, isTouch]);

    useEffect(() => {
        if (!active || isTouch) {
            return;
        }

        const handleGlobalClick = (event: MouseEvent) => {
            if (window.getSelection()?.toString()) {
                return;
            }

            const target = event.target;

            if (target instanceof HTMLElement) {
                const interactiveElement = target.closest('input, textarea, button, a');

                if (interactiveElement) {
                    return;
                }
            }

            inputRef.current?.focus({ preventScroll: true });
        };

        document.addEventListener('click', handleGlobalClick);

        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, [active, isTouch]);

    const position = Math.min(caret, inputValue.length);
    const completion = position === inputValue.length ? completionFor(inputValue) : null;
    const suggestion = completion && completion.matches.length > 0 ? commonPrefix(completion.matches) : '';
    const ghost = completion && suggestion.length > completion.prefix.length ? suggestion.slice(completion.prefix.length) : '';

    return (

        <div className="flex min-w-0 items-center gap-2 cursor-text" onClick={handleClick}>
            <span className="shrink-0 text-blue-500">guest@os:~$</span>
            <input
                onKeyDown={handleKeyDown}
                onSelect={(event) => setCaret(event.currentTarget.selectionStart ?? event.currentTarget.value.length)}
                className="sr-only"
                type="text"
                ref={inputRef}
                aria-label={t('terminal.inputLabel')}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                value={inputValue}
                onChange={(event) => {
                    setInputValue(event.target.value);
                    setCaret(event.target.selectionStart ?? event.target.value.length);
                    setHint('');
                }}
            />
            <div className="flex min-w-0 items-center whitespace-pre text-slate-400" aria-hidden="true">
                <span>{inputValue.slice(0, position)}</span>
                <span className="inline-block min-w-[1ch] leading-none bg-blue-500 text-slate-950 animate-pulse">{inputValue.slice(position, position + 1) || ghost.slice(0, 1) || ' '}</span>
                <span>{inputValue.slice(position + 1)}</span>
                <span className="text-slate-600">{ghost.slice(1)}</span>
            </div>
            <span role="status" className="ml-2 min-w-0 truncate text-slate-500">{hint}</span>
        </div>
    );
}

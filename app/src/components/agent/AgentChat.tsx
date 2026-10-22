import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Send, Sparkles, Square } from 'lucide-react';
import type { AgentDraft } from '../../types';
import { MAX_MESSAGE } from '../../services/gemini';
import { MarkdownText } from '../ui/MarkdownText';
import { useAgentChat } from '../../hooks/useAgentChat';

const tones = {
    standard: {
        root: 'flex min-w-0 flex-1 flex-col gap-4 rounded-2xl border border-line bg-surface/95 p-5 shadow-brand backdrop-blur-xl',
        header: 'flex items-center justify-between gap-4',
        status: 'flex items-center gap-2 text-sm',
        reset: 'flex items-center gap-2 rounded-md border border-body/20 px-3 py-1.5 text-sm hover:border-brand hover:text-brand transition-colors disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer',
        resetIcon: 15,
        list: 'h-[26rem] overflow-y-auto pr-2',
        messages: 'flex flex-col gap-4 text-sm',
        author: 'text-xs text-brand',
        modelName: 'Leonardo',
        welcome: 'rounded-xl rounded-tl-sm bg-body/10 p-3',
        question: 'whitespace-pre-wrap break-words rounded-xl rounded-tr-sm bg-brand px-3 py-2 text-on-brand',
        answer: 'flex flex-col gap-2 break-words rounded-xl rounded-tl-sm bg-body/10 p-3',
        error: 'rounded-xl rounded-tl-sm border border-red-500/40 bg-red-500/5 p-3 text-red-500',
        cursor: 'h-4 w-2 animate-pulse bg-brand',
        stopped: 'text-xs opacity-70',
        suggestions: 'flex flex-wrap gap-2',
        suggestion: 'rounded-xl border border-brand/40 px-3 py-1.5 text-xs text-brand hover:bg-brand/10 transition-colors cursor-pointer',
        form: 'flex flex-col gap-2',
        input: 'min-h-11 max-h-36 flex-1 resize-none rounded-md border border-body/20 bg-body/5 px-3 py-2 text-sm text-title [field-sizing:content] placeholder:text-body/70 hover:border-brand focus:border-brand focus:outline-none',
        stop: 'flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-body/20 hover:border-brand hover:text-brand transition-colors cursor-pointer',
        send: 'flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand text-on-brand hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer',
        footer: 'flex justify-between gap-4 text-xs',
        preventScroll: true,
    },
    system: {
        root: 'h-full flex flex-col gap-4 min-h-0',
        header: 'shrink-0 flex items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-lg',
        status: 'flex items-center gap-2 text-sm text-slate-400',
        reset: 'shrink-0 flex items-center gap-2 border border-slate-700/60 px-3 py-2 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        resetIcon: 16,
        list: 'flex-1 min-h-48 md:flex-none md:h-[45dvh] overflow-y-auto pr-2',
        messages: 'flex flex-col gap-4 text-base',
        author: 'text-xs text-blue-500',
        modelName: 'leonardo@agent',
        welcome: 'bg-slate-800/60 p-3 rounded-lg text-slate-400',
        question: 'bg-slate-700/60 p-3 rounded-lg text-slate-200 whitespace-pre-wrap break-words',
        answer: 'flex flex-col gap-2 bg-slate-800/60 p-3 rounded-lg text-slate-400 break-words',
        error: 'bg-slate-800/60 border border-red-400/40 p-3 rounded-lg text-red-400',
        cursor: 'w-2 h-4 bg-blue-500 animate-pulse',
        stopped: 'text-xs text-slate-400',
        suggestions: 'flex flex-wrap gap-3',
        suggestion: 'border border-slate-700/50 px-3 py-2 md:py-1 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors cursor-pointer',
        form: 'shrink-0 flex flex-col gap-2',
        input: 'flex-1 min-h-11 max-h-36 [field-sizing:content] bg-slate-800/60 border border-slate-700/60 rounded-md px-3 py-2 text-base text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-500 resize-none',
        stop: 'shrink-0 h-11 w-11 flex items-center justify-center border border-slate-700/60 rounded-md text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors',
        send: 'shrink-0 h-11 w-11 flex items-center justify-center border border-slate-700/60 rounded-md text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        footer: 'flex justify-between gap-4 text-xs text-slate-400',
        preventScroll: false,
    },
};

export interface AgentChatProps {
    tone?: keyof typeof tones;
    draft?: AgentDraft | null;
}

export function AgentChat({ tone = 'standard', draft = null }: AgentChatProps) {
    const { t } = useTranslation();
    const styles = tones[tone];
    const isSystem = tone === 'system';
    const { messages, input, setInput, loading, send, stop, reset, errorText } = useAgentChat();
    const [appliedDraft, setAppliedDraft] = useState<AgentDraft | null>(null);

    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    if (draft !== appliedDraft) {
        setAppliedDraft(draft);
        if (draft) setInput(draft.text.slice(0, MAX_MESSAGE));
    }

    useEffect(() => {
        if (!draft) return;

        const frame = requestAnimationFrame(() => inputRef.current?.focus());
        return () => cancelAnimationFrame(frame);
    }, [draft]);

    const suggestions = t('agent.suggestions', { returnObjects: true }) as string[];

    useEffect(() => {
        const listElement = listRef.current;
        if (!listElement) return;

        listElement.scrollTo({ top: listElement.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    async function ask(text: string) {
        await send(text);
        inputRef.current?.focus({ preventScroll: styles.preventScroll });
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        ask(input);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            ask(input);
        }
    }

    const status = (
        <span className={styles.status}>
            <span className={`h-2 w-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
            {loading ? t('agent.typing') : t('agent.status')}
        </span>
    );

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                {isSystem ? (
                    <div className="flex items-center gap-3 min-w-0">
                        <Sparkles size={24} className="shrink-0 text-blue-500" />

                        <div className="flex flex-col min-w-0">
                            <h2 className="text-xl font-bold">{t('agent.title')}</h2>
                            {status}
                        </div>
                    </div>
                ) : status}

                <button
                    type="button"
                    onClick={reset}
                    disabled={messages.length === 0}
                    aria-label={t('agent.reset')}
                    className={styles.reset}
                >
                    <RotateCcw size={styles.resetIcon} />
                    <span className="hidden sm:inline">{t('agent.reset')}</span>
                </button>
            </div>

            <div ref={listRef} aria-live="polite" className={styles.list}>
                <div className={styles.messages}>
                    <div className="flex max-w-[85%] flex-col gap-1 self-start">
                        <span className={styles.author}>{styles.modelName}</span>
                        <p className={styles.welcome}>{t('agent.welcome')}</p>
                    </div>

                    {messages.map((message) => (
                        message.role === 'user' ? (
                            <div key={message.id} className="flex max-w-[85%] flex-col items-end gap-1 self-end">
                                <span className={styles.author}>{isSystem ? 'guest@os' : t('standard.agent.you')}</span>
                                <p className={styles.question}>{message.text}</p>
                            </div>
                        ) : (
                            <div key={message.id} className="flex max-w-[85%] flex-col gap-1 self-start">
                                <span className={styles.author}>{styles.modelName}</span>

                                {message.errorCode ? (
                                    <p role="status" className={styles.error}>{errorText(message)}</p>
                                ) : (
                                    <div className={styles.answer}>
                                        {message.text && <MarkdownText text={message.text} tone={tone} />}

                                        {message.streaming && (
                                            <div className={styles.cursor} aria-label={t('agent.typing')} />
                                        )}

                                        {message.stopped && (
                                            <span className={styles.stopped}>{t('agent.stopped')}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    ))}

                    {messages.length === 0 && (
                        <div className={styles.suggestions}>
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => ask(suggestion)}
                                    className={styles.suggestion}
                                >
                                    {isSystem ? `[ ${suggestion} ]` : suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className="flex items-end gap-2">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(event) => setInput(event.target.value.slice(0, MAX_MESSAGE))}
                        onKeyDown={handleKeyDown}
                        placeholder={t('agent.placeholder')}
                        aria-label={t('agent.inputLabel')}
                        rows={1}
                        className={styles.input}
                    />

                    {loading ? (
                        <button type="button" onClick={stop} aria-label={t('agent.stop')} className={styles.stop}>
                            <Square size={16} />
                        </button>
                    ) : (
                        <button type="submit" disabled={!input.trim()} aria-label={t('agent.send')} className={styles.send}>
                            <Send size={16} />
                        </button>
                    )}
                </div>

                <div className={styles.footer}>
                    <p>{t('agent.disclaimer')}</p>
                    <span className="shrink-0">{input.length}/{MAX_MESSAGE}</span>
                </div>
            </form>
        </div>
    );
}

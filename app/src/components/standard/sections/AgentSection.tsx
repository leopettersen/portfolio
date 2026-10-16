import { useEffect, useRef, type FormEvent, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Send, Square } from 'lucide-react';
import { MAX_MESSAGE } from '../../../services/gemini';
import { MarkdownText } from '../../ui/MarkdownText';
import { useAgentChat } from '../../../hooks/useAgentChat';
import { SectionCard } from '../SectionCard';

export function AgentSection() {
    const { t } = useTranslation();
    const { messages, input, setInput, loading, send, stop, reset, errorText } = useAgentChat();

    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const suggestions = t('agent.suggestions', { returnObjects: true }) as string[];

    useEffect(() => {
        const listElement = listRef.current;
        if (!listElement) return;

        listElement.scrollTo({ top: listElement.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    async function ask(text: string) {
        await send(text);
        inputRef.current?.focus({ preventScroll: true });
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

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 xl:flex-row">
            <SectionCard
                tag={t('standard.agent.tag')}
                title1={t('standard.agent.title1')}
                title2={t('standard.agent.title2')}
                description={t('standard.agent.text')}
                sticky
                className="xl:w-96 xl:shrink-0"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-2xl border border-line bg-surface/95 p-5 shadow-brand backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2 text-sm">
                        <span className={`h-2 w-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                        {loading ? t('agent.typing') : t('agent.status')}
                    </span>

                    <button
                        type="button"
                        onClick={reset}
                        disabled={messages.length === 0}
                        aria-label={t('agent.reset')}
                        className="flex items-center gap-2 rounded-md border border-body/20 px-3 py-1.5 text-sm hover:border-brand hover:text-brand transition-colors disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    >
                        <RotateCcw size={15} />
                        <span className="hidden sm:inline">{t('agent.reset')}</span>
                    </button>
                </div>

                <div ref={listRef} aria-live="polite" className="h-[26rem] overflow-y-auto pr-2">
                    <div className="flex flex-col gap-4 text-sm">
                        <div className="flex max-w-[85%] flex-col gap-1 self-start">
                            <span className="text-xs text-brand">Leonardo</span>
                            <p className="rounded-xl rounded-tl-sm bg-body/10 p-3">{t('agent.welcome')}</p>
                        </div>

                        {messages.map((message) => (
                            message.role === 'user' ? (
                                <div key={message.id} className="flex max-w-[85%] flex-col items-end gap-1 self-end">
                                    <span className="text-xs text-brand">{t('standard.agent.you')}</span>
                                    <p className="whitespace-pre-wrap break-words rounded-xl rounded-tr-sm bg-brand px-3 py-2 text-on-brand">
                                        {message.text}
                                    </p>
                                </div>
                            ) : (
                                <div key={message.id} className="flex max-w-[85%] flex-col gap-1 self-start">
                                    <span className="text-xs text-brand">Leonardo</span>

                                    {message.errorCode ? (
                                        <p role="status" className="rounded-xl rounded-tl-sm border border-red-500/40 bg-red-500/5 p-3 text-red-500">
                                            {errorText(message)}
                                        </p>
                                    ) : (
                                        <div className="flex flex-col gap-2 break-words rounded-xl rounded-tl-sm bg-body/10 p-3">
                                            {message.text && <MarkdownText text={message.text} tone="standard" />}

                                            {message.streaming && (
                                                <div className="h-4 w-2 animate-pulse bg-brand" aria-label={t('agent.typing')} />
                                            )}

                                            {message.stopped && (
                                                <span className="text-xs opacity-70">{t('agent.stopped')}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        ))}

                        {messages.length === 0 && (
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => ask(suggestion)}
                                        className="rounded-xl border border-brand/40 px-3 py-1.5 text-xs text-brand hover:bg-brand/10 transition-colors cursor-pointer"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <div className="flex items-end gap-2">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(event) => setInput(event.target.value.slice(0, MAX_MESSAGE))}
                            onKeyDown={handleKeyDown}
                            placeholder={t('agent.placeholder')}
                            aria-label={t('agent.inputLabel')}
                            rows={1}
                            className="min-h-11 max-h-36 flex-1 resize-none rounded-md border border-body/20 bg-body/5 px-3 py-2 text-sm text-title [field-sizing:content] placeholder:text-body/70 hover:border-brand focus:border-brand focus:outline-none"
                        />

                        {loading ? (
                            <button
                                type="button"
                                onClick={stop}
                                aria-label={t('agent.stop')}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-body/20 hover:border-brand hover:text-brand transition-colors cursor-pointer"
                            >
                                <Square size={16} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                aria-label={t('agent.send')}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand text-on-brand hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                            >
                                <Send size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex justify-between gap-4 text-[11px]">
                        <p>{t('agent.disclaimer')}</p>
                        <span className="shrink-0">{input.length}/{MAX_MESSAGE}</span>
                    </div>
                </form>
            </div>
        </div>
    );
}

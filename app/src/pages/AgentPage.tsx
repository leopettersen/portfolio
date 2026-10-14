import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Send, Sparkles, Square } from 'lucide-react';

import type { AgentMessage } from '../types';
import { askGemini, GeminiError, MAX_MESSAGE } from '../services/gemini';
import { MarkdownText } from '../components/ui/MarkdownText';

export function AgentPage() {
    const { t } = useTranslation();

    const [messages, setMessages] = useState<AgentMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const abortRef = useRef<AbortController | null>(null);
    const nextId = useRef(1);

    const suggestions = t('agent.suggestions', { returnObjects: true }) as string[];

    useEffect(() => {
        const listElement = listRef.current;
        if (!listElement) return;

        listElement.scrollTo({
            top: listElement.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);

    useEffect(() => {
        return () => abortRef.current?.abort();
    }, []);

    function errorText(message: AgentMessage) {
        return t(`agent.errors.${message.errorCode}`, {
            defaultValue: t('agent.errors.generic'),
            seconds: message.retryAfter ?? 60,
        });
    }

    async function send(text: string) {
        const question = text.trim();
        if (!question || loading) return;

        const history = messages
            .filter((message) => !message.errorCode && !message.streaming && message.text)
            .map(({ role, text }) => ({ role, text }));

        const answerId = nextId.current + 1;
        nextId.current += 2;

        setMessages((prev) => [
            ...prev,
            { id: answerId - 1, role: 'user', text: question },
            { id: answerId, role: 'model', text: '', streaming: true },
        ]);
        setInput('');
        setLoading(true);

        const controller = new AbortController();
        abortRef.current = controller;

        function update(patch: Partial<AgentMessage>) {
            setMessages((prev) => prev.map((message) => (message.id === answerId ? { ...message, ...patch } : message)));
        }

        try {
            await askGemini(question, {
                history,
                signal: controller.signal,
                onChunk: (partial) => update({ text: partial }),
            });

            update({ streaming: false });
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                update({ streaming: false, stopped: true });
            } else {
                console.error(error);

                update({
                    streaming: false,
                    errorCode: error instanceof GeminiError ? error.code : 'generic',
                    retryAfter: error instanceof GeminiError ? error.retryAfter : null,
                });
            }
        } finally {
            setLoading(false);
            abortRef.current = null;
            inputRef.current?.focus();
        }
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        send(input);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            send(input);
        }
    }

    function handleReset() {
        abortRef.current?.abort();
        setMessages([]);
        setInput('');
    }

    return (
        <div className="h-full flex flex-col gap-4 min-h-0">

            {/* Cabeçalho */}
            <div className="shrink-0 flex items-center justify-between gap-4 bg-slate-800/60 p-4 rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                    <Sparkles size={24} className="shrink-0 text-blue-500" />

                    <div className="flex flex-col min-w-0">
                        <h1 className="text-xl font-bold">
                            {t('agent.title')}
                        </h1>

                        <span className="flex items-center gap-2 text-sm text-slate-400">
                            <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                            {loading ? t('agent.typing') : t('agent.status')}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleReset}
                    disabled={messages.length === 0}
                    aria-label={t('agent.reset')}
                    className="shrink-0 flex items-center gap-2 border border-slate-700/60 px-3 py-2 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RotateCcw size={16} />
                    <span className="hidden sm:inline">{t('agent.reset')}</span>
                </button>
            </div>

            {/* Mensagens */}
            <div ref={listRef} aria-live="polite" className="flex-1 min-h-48 md:flex-none md:h-[45dvh] overflow-y-auto pr-2">
                <div className="flex flex-col gap-4 text-base">

                    <div className="self-start max-w-[85%] flex flex-col gap-1">
                        <span className="text-xs text-blue-500">leonardo@agent</span>
                        <p className="bg-slate-800/60 p-3 rounded-lg text-slate-400">
                            {t('agent.welcome')}
                        </p>
                    </div>

                    {messages.map((message) => (
                        message.role === 'user' ? (
                            <div key={message.id} className="self-end max-w-[85%] flex flex-col items-end gap-1">
                                <span className="text-xs text-blue-500">guest@os</span>
                                <p className="bg-slate-700/60 p-3 rounded-lg text-slate-200 whitespace-pre-wrap break-words">
                                    {message.text}
                                </p>
                            </div>
                        ) : (
                            <div key={message.id} className="self-start max-w-[85%] flex flex-col gap-1">
                                <span className="text-xs text-blue-500">leonardo@agent</span>

                                {message.errorCode ? (
                                    <p role="status" className="bg-slate-800/60 border border-red-400/40 p-3 rounded-lg text-red-400">
                                        {errorText(message)}
                                    </p>
                                ) : (
                                    <div className="flex flex-col gap-2 bg-slate-800/60 p-3 rounded-lg text-slate-400 break-words">
                                        {message.text && <MarkdownText text={message.text} />}

                                        {message.streaming && (
                                            <div className="w-2 h-4 bg-blue-500 animate-pulse" aria-label={t('agent.typing')} />
                                        )}

                                        {message.stopped && (
                                            <span className="text-xs text-slate-500">{t('agent.stopped')}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    ))}

                    {messages.length === 0 && (
                        <div className="flex flex-wrap gap-3">
                            {suggestions.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => send(suggestion)}
                                    className="border border-slate-700/50 px-3 py-2 md:py-1 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors cursor-pointer"
                                >
                                    [ {suggestion} ]
                                </button>
                            ))}
                        </div>
                    )}

                </div>
            </div>

            {/* Pergunta */}
            <form onSubmit={handleSubmit} className="shrink-0 flex flex-col gap-2">
                <div className="flex items-end gap-2">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(event) => setInput(event.target.value.slice(0, MAX_MESSAGE))}
                        onKeyDown={handleKeyDown}
                        placeholder={t('agent.placeholder')}
                        aria-label={t('agent.inputLabel')}
                        rows={1}
                        className="flex-1 min-h-11 max-h-36 [field-sizing:content] bg-slate-800/60 border border-slate-700/60 rounded-md px-3 py-2 text-base text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-500 resize-none"
                    />

                    {loading ? (
                        <button
                            type="button"
                            onClick={() => abortRef.current?.abort()}
                            aria-label={t('agent.stop')}
                            className="shrink-0 h-11 w-11 flex items-center justify-center border border-slate-700/60 rounded-md text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors"
                        >
                            <Square size={16} />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            aria-label={t('agent.send')}
                            className="shrink-0 h-11 w-11 flex items-center justify-center border border-slate-700/60 rounded-md text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={16} />
                        </button>
                    )}
                </div>

                <div className="flex justify-between gap-4">
                    <p className="text-xs text-slate-500">
                        {t('agent.disclaimer')}
                    </p>

                    <span className="shrink-0 text-xs text-slate-500">
                        {input.length}/{MAX_MESSAGE}
                    </span>
                </div>
            </form>

        </div>
    );
}

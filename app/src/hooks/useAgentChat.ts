import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AgentMessage } from '../types';
import { askGemini, GeminiError } from '../services/gemini';

export function useAgentChat() {
    const { t, i18n } = useTranslation();
    const language = i18n.resolvedLanguage === 'en' ? 'en' : 'pt';

    const [messages, setMessages] = useState<AgentMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const abortRef = useRef<AbortController | null>(null);
    const nextId = useRef(1);

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
                language,
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
        }
    }

    function stop() {
        abortRef.current?.abort();
    }

    function reset() {
        abortRef.current?.abort();
        setMessages([]);
        setInput('');
    }

    return { messages, input, setInput, loading, send, stop, reset, errorText };
}

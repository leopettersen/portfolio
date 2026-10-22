import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AgentHistoryEntry, TerminalAnswer } from '../types';
import { streamAnswer } from '../services/gemini';

export function useTerminalAgent() {
    const { i18n } = useTranslation();
    const language = i18n.resolvedLanguage === 'en' ? 'en' : 'pt';

    const [answers, setAnswers] = useState<Record<number, TerminalAnswer>>({});
    const abortRef = useRef<AbortController | null>(null);
    const nextId = useRef(1);

    useEffect(() => {
        return () => abortRef.current?.abort();
    }, []);

    const busy = Object.values(answers).some((answer) => answer.streaming);

    function ask(question: string) {
        const id = nextId.current++;

        const history: AgentHistoryEntry[] = Object.values(answers)
            .filter((answer) => !answer.streaming && !answer.errorCode && !answer.stopped && answer.text)
            .flatMap((answer) => [
                { role: 'user' as const, text: answer.question },
                { role: 'model' as const, text: answer.text },
            ]);

        setAnswers((prev) => ({ ...prev, [id]: { question, text: '', streaming: true } }));

        function update(patch: Partial<TerminalAnswer>) {
            setAnswers((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], ...patch } } : prev));
        }

        const controller = new AbortController();
        abortRef.current = controller;

        streamAnswer(question, { history, language, signal: controller.signal }, update).then(() => {
            if (abortRef.current === controller) abortRef.current = null;
        });

        return id;
    }

    function reset() {
        abortRef.current?.abort();
        setAnswers({});
    }

    return { answers, busy, ask, reset };
}

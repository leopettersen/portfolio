import type { AgentHistoryEntry } from '../types';

export const GEMINI_PATH = '/api/gemini';
export const MAX_MESSAGE = 1000;
export const MAX_HISTORY = 10;

// code vem do servidor (api/_gemini.ts): missing_key, rate_limited, quota, timeout...
export class GeminiError extends Error {
    code: string;
    retryAfter: number | null;

    constructor(code: string, message: string, retryAfter: number | null = null) {
        super(message);
        this.code = code;
        this.retryAfter = retryAfter;
    }
}

export type AgentLanguage = 'pt' | 'en';

interface AskOptions {
    history?: AgentHistoryEntry[];
    language?: AgentLanguage;
    signal?: AbortSignal;
    onChunk?: (text: string) => void;
}

export async function askGemini(message: string, { history = [], language, signal, onChunk }: AskOptions = {}): Promise<string> {
    let response: Response;

    try {
        response = await fetch(GEMINI_PATH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history: history.slice(-MAX_HISTORY), language }),
            signal,
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') throw error;
        throw new GeminiError('network', 'Sem conexão com o servidor.');
    }

    // Sem a função (ex.: build estático sem /api), a rota devolve o index.html
    const rateLimited = response.status === 429;

    if (!rateLimited && (response.headers.get('content-type') ?? '').includes('text/html')) {
        throw new GeminiError('no_api', 'A rota /api/gemini não existe aqui.');
    }

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const retryAfter = Number(response.headers.get('Retry-After')) || null;
        throw new GeminiError(body.error ?? (rateLimited ? 'rate_limited' : 'error'), body.message ?? `HTTP ${response.status}`, retryAfter);
    }

    if (!response.body) {
        throw new GeminiError('empty', 'O Gemini não devolveu nenhum texto.');
    }

    // Lê o corpo aos pedaços: o texto vai aparecendo enquanto o Gemini escreve
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let text = '';

    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        text += decoder.decode(value, { stream: true });
        onChunk?.(text);
    }

    text = (text + decoder.decode()).trim();

    if (!text) {
        throw new GeminiError('empty', 'O Gemini não devolveu nenhum texto.');
    }

    onChunk?.(text);
    return text;
}

export interface AnswerPatch {
    text?: string;
    streaming?: boolean;
    stopped?: boolean;
    errorCode?: string;
    retryAfter?: number | null;
}

export async function streamAnswer(question: string, options: Omit<AskOptions, 'onChunk'>, update: (patch: AnswerPatch) => void) {
    try {
        await askGemini(question, { ...options, onChunk: (text) => update({ text }) });
        update({ streaming: false });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            update({ streaming: false, stopped: true });
            return;
        }

        console.error(error);
        update({
            streaming: false,
            errorCode: error instanceof GeminiError ? error.code : 'generic',
            retryAfter: error instanceof GeminiError ? error.retryAfter : null,
        });
    }
}

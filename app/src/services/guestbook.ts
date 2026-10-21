import type { GuestbookMessage } from '../types';

export const PAGE_SIZE = 20;

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/+$/, '');
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

async function request<T>(params: URLSearchParams, body?: object): Promise<T> {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env');
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/guestbook_messages?${params}`, body
        ? {
            method: 'POST',
            headers: { apikey: supabaseKey, 'Content-Type': 'application/json', Prefer: 'return=representation' },
            body: JSON.stringify(body),
        }
        : { headers: { apikey: supabaseKey } });

    if (!response.ok) {
        throw new Error(`Supabase respondeu HTTP ${response.status}: ${await response.text().catch(() => '')}`);
    }

    return response.json();
}

export async function fetchMessages(lastId?: number): Promise<GuestbookMessage[]> {
    const params = new URLSearchParams({ select: '*', order: 'id.desc', limit: String(PAGE_SIZE) });

    if (lastId) {
        params.set('id', `lt.${lastId}`);
    }

    return request<GuestbookMessage[]>(params);
}

export async function addMessage(name: string, message: string): Promise<GuestbookMessage> {
    const [createdMessage] = await request<GuestbookMessage[]>(new URLSearchParams({ select: '*' }), {
        name: name.trim(),
        message: message.trim(),
    });

    return createdMessage;
}

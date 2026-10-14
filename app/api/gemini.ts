// Vercel Function: POST /api/gemini { message, history }
// Lê GEMINI_API_KEY (e, opcionalmente, GEMINI_MODEL) das Environment Variables da Vercel.
// A lógica fica em api/_gemini.ts, que o vite.config.ts também usa no npm run dev.

import type { ServerResponse } from 'node:http';
import { handleGemini, type GeminiRequest } from './_gemini.js';

export default function handler(req: GeminiRequest, res: ServerResponse) {
    return handleGemini(req, res, process.env);
}

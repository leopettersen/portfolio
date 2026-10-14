import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Connect, Plugin } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import { handleGemini, GEMINI_PATH, type GeminiEnv } from './api/_gemini.js'

// No npm run dev e no npm run preview, a rota /api/gemini é atendida por este middleware.
// Em produção, quem atende é a Vercel Function api/gemini.ts.
function geminiApi(env: GeminiEnv): Plugin {
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    if (new URL(req.url ?? '', 'http://localhost').pathname !== GEMINI_PATH) return next()
    handleGemini(req, res, env).catch(next)
  }

  return {
    name: 'gemini-api',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Prefixo '' lê também as variáveis sem VITE_; elas continuam só no servidor
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      geminiApi(env),
    ],
  }
})

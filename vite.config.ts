import { defineConfig, loadEnv } from 'vite'

export default defineConfig(async ({ mode }) => {
  // dynamic import to avoid ESM plugin load issues in some environments
  const reactPlugin = (await import('@vitejs/plugin-react')).default
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [reactPlugin()],
    server: { port: 5173 }
  }
})

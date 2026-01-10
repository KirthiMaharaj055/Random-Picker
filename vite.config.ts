import { defineConfig } from 'vite'

export default defineConfig(async () => {
  // dynamic import to avoid ESM plugin load issues in some environments
  const reactPlugin = (await import('@vitejs/plugin-react')).default
  return {
    plugins: [reactPlugin()],
    server: { port: 5173 }
  }
})

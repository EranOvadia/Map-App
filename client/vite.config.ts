import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      // In dev the client calls /api on its own origin; Vite forwards it to the ASP.NET Core server.
      proxy: {
        '/api': {
          target: env.API_PROXY_TARGET || 'http://localhost:5110',
          changeOrigin: true,
        },
      },
    },
  }
})

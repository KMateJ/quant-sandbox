import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { seoPages } from './seo.plugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoPages()],
})

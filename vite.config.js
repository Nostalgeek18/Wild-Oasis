import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint'
//do plugins: [react(), eslint()] to add eslint back
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})

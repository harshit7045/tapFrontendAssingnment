import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // No hardcoded API URLs here; use import.meta.env.VITE_API_BASE_URL in the app
});

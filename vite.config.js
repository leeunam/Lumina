import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import react from 'react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
})

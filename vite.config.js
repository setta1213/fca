import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// export default defineConfig({
//   base: '/fca/main/',
//   plugins: [
//     react(), 
//     tailwindcss(),
//   ], 
//   server: {
//     port: 5173,
//     host: true,
//   },
// })

export default defineConfig({
  base: '/fca/main/',
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: true,
  },
})
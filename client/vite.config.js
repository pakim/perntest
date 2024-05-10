import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api/register': 'http://localhost:3000',
      // '/api/login': 'http://localhost:3000',
      // '/api/authenticate': 'http://localhost:3000',
      // '/api/logout': 'http://localhost:3000',
      '/api': {
        target: 'http://localhost:3000',
        // Other proxy options if needed
      }
    }
  },
})

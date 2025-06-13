import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3003,
      strictPort: true,
      hmr: true,
    },
    define: {
      // Temporarily hardcoded values to bypass environment file issues
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://engage-api-bmb0fqhpg7bkdwdp.eastus2-01.azurewebsites.net'),
      'import.meta.env.VITE_API_TIMEOUT': JSON.stringify('30000'),
      'import.meta.env.VITE_X_API_KEY': JSON.stringify('d3ae2eec-604a-402e-a414-c7e4cc0e2b2e'),
      'import.meta.env.VITE_X_API_SECRET': JSON.stringify('Kj#9mP$vN2xL&hQ5wR8tY3cB@nM4fD7'),
      'import.meta.env.VITE_MAX_FILE_SIZE': JSON.stringify('5242880'),
      'import.meta.env.VITE_ALLOWED_FILE_TYPES': JSON.stringify('application/pdf,image/jpeg,image/png'),
    },
  };
}); 
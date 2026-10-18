import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode ?? 'test', process.cwd(), '');

  return {
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
      env: { ...env },
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), './src'),
      },
    },
  };
});

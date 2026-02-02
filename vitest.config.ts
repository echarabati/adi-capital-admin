import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'tests/e2e'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**', 'lib/**', 'config/**'],
      exclude: [
        'src/components/ui/**', // Exclude shadcn UI from strict coverage
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
  resolve: {
    alias: {
      '@/config': path.resolve(__dirname, './src/config'),
      '@': path.resolve(__dirname, './'),
    },
  },
});

import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
import vue from '@vitejs/plugin-vue'

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [vue()],
    test: {
      globals: true,
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      include: ['src/tests/**/*.test.ts'],
      coverage: {
        reporter: ['text', 'html'],
        exclude: [
          'node_modules/',
          'src/main.ts',
          'src/router/',
          'src/assets/',
        ],
      },
    },
  }),
)

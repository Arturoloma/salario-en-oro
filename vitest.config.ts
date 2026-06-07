import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
      include: ['scripts/data/**/*.ts', 'src/lib/**/*.ts'],
      exclude: [
        'scripts/data/update-data.ts',
        'scripts/data/validate-data-files.ts',
        'scripts/data/types.ts',
        '**/*.test.ts',
      ],
    },
  },
});

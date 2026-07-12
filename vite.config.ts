import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import packageJson from './package.json' with { type: 'json' };

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	define: {
		__APP_VERSION__: JSON.stringify(packageJson.version)
	},
	resolve: mode === 'test' ? { conditions: ['browser'] } : undefined,
	test: {
		include: ['src/**/*.test.ts'],
		setupFiles: ['./src/test-setup.ts']
	}
}));

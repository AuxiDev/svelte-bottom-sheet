import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import packageJson from './package.json' with { type: 'json' };

export default defineConfig({
	plugins: [sveltekit({ preprocess: vitePreprocess(), adapter: adapter() })],
	define: { __APP_VERSION__: JSON.stringify(packageJson.version) },
	server: { host: true }
});

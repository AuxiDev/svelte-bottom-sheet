import { mdsvex, escapeSvelte } from 'mdsvex';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { remarkExtractHeadings } from './remarkExtractHeading.ts';
import rehypeSlug from 'rehype-slug';
import { createHighlighter } from 'shiki';
import packageJson from './package.json' with { type: 'json' };

export default defineConfig({
	define: { __APP_VERSION__: JSON.stringify(packageJson.version) },
	server: { host: true },
	plugins: [
		tailwindcss(),
		sveltekit({
			adapter: adapter(),
			preprocess: [
				mdsvex({
					extensions: ['.svx', '.md'],
					remarkPlugins: [remarkExtractHeadings as any],
					rehypePlugins: [rehypeSlug as any],
					highlight: {
						highlighter: async (code, lang, meta) => {
							const highlighter = await createHighlighter({
								themes: ['github-light'],
								langs: ['javascript', 'typescript', 'bash', 'html', 'css', 'svelte']
							});

							const html = highlighter.codeToHtml(code, {
								lang: lang || 'plaintext',
								themes: {
									light: 'github-light'
								}
							});

							return escapeSvelte(html);
						}
					}
				})
			],
			extensions: ['.svelte', '.svx', '.md']
		})
	]
});

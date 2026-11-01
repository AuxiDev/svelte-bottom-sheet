import { SITE_URL } from '#lib/config.ts';

export const prerender = true;

const paths = [
	'/',
	'/docs/getting-started',
	'/docs/api',
	'/docs/styling',
	'/docs/example-basics',
	'/docs/example-floating',
	'/docs/migrate-v2-to-v3'
];

export const GET = () => {
	const baseUrl = SITE_URL.replace(/\/+$/, '');

	const urls = paths
		.map((path) => `<url><loc>${baseUrl}${path === '/' ? '/' : path}</loc></url>`)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8'
		}
	});
};

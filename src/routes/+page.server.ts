import { env } from '$env/dynamic/private';

const CACHE_TTL = 20 * 1000;
let cachedData: { stars: number; timestamp: number } | null = null;

export async function load({ setHeaders }) {
	if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
		return cachedData;
	}

	try {
		const headers: HeadersInit = {};
		if (env.GITHUB_TOKEN) {
			headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
		}

		const response = await fetch(`https://api.github.com/repos/auxidev/svelte-bottom-sheet`, {
			headers
		});

		if (!response.ok) {
			cachedData = { stars: 219, timestamp: Date.now() };
			return cachedData;
		}

		const data = await response.json();
		cachedData = { stars: data.stargazers_count, timestamp: Date.now() };

		setHeaders({
			'Cache-Control': 'public, max-age=3600'
		});

		return cachedData;
	} catch (err) {
		cachedData = { stars: 219, timestamp: Date.now() };
		return cachedData;
	}
}

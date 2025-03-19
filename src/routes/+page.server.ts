import { error } from '@sveltejs/kit';
import { GITHUB_TOKEN } from '$env/static/private';

const CACHE_TTL = 20 * 1000;
let cachedData: { stars: number; timestamp: number } | null = null;

export async function load({ setHeaders }) {
	if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
		return cachedData;
	}

	if (!GITHUB_TOKEN) {
		throw error(500, 'GitHub token is missing. -> Set in env vars.');
	}

	try {
		const response = await fetch(`https://api.github.com/repos/auxidev/svelte-bottom-sheet`, {
			headers: {
				Authorization: `token ${GITHUB_TOKEN}`
			}
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

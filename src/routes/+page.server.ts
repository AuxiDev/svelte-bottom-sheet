import { error } from '@sveltejs/kit';
import { GITHUB_TOKEN } from '$env/static/private';

const repo = 'auxidev/svelte-bottom-sheet';

export async function load() {
	if (!GITHUB_TOKEN) {
		throw error(500, 'GitHub token is missing. -> Set in env vars.');
	}

	try {
		const response = await fetch(`https://api.github.com/repos/${repo}`, {
			headers: {
				Authorization: `token ${GITHUB_TOKEN}`
			}
		});

		if (!response.ok) {
			return { stars: 219 };
		}

		const data = await response.json();
		return { stars: data.stargazers_count };
	} catch (err) {
		return { stars: 219 };
	}
}

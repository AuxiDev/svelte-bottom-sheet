import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	try {
		const post = await import(`#lib/sites/docs/${params.slug}.md`);
		return {
			content: post.default,
			headings: post.metadata?.headings ?? []
		};
	} catch {
		error(404, 'Documentation page not found');
	}
};

import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import GithubSlugger from 'github-slugger';

export const remarkExtractHeadings = () => {
	return (tree: any, file: any) => {
		const slugger = new GithubSlugger();
		const headings: { level: number; text: string; id: string }[] = [];

		visit(tree, 'heading', (node: any) => {
			if (node.depth === 2 || node.depth === 3) {
				const text = toString(node);
				headings.push({
					level: node.depth,
					text,
					id: slugger.slug(text)
				});
			}
		});

		// Injects headings into mdsvex metadata
		file.data.fm ??= {};
		file.data.fm.headings = headings;
	};
};

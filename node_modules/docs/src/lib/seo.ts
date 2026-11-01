import { DEFAULT_DESCRIPTION, SITE_NAME } from './config';

export type PageSeo = {
	title: string;
	description: string;
};

export const seoByPath: Record<string, PageSeo> = {
	'/': {
		title: 'svelte-bottom-sheet - Bottom Sheets for Svelte 5',
		description:
			'A lightweight, customizable bottom sheet / drawer component with flexible positioning, smooth gestures, snap points and tons of options to customize the behaviour for your needs.'
	},
	'/docs/getting-started': {
		title: 'Getting Started - svelte-bottom-sheet',
		description:
			'Install svelte-bottom-sheet and learn how to create your first customizable bottom sheet in a Svelte 5 application.'
	},
	'/docs/api': {
		title: 'API Reference - svelte-bottom-sheet',
		description:
			'Explore the svelte-bottom-sheet API, component props, events, positioning options and exports.'
	},
	'/docs/styling': {
		title: 'Styling and Customization - svelte-bottom-sheet',
		description: 'Learn how to style and customize svelte-bottom-sheet components.'
	},
	'/docs/example-basics': {
		title: 'Basic Examples - svelte-bottom-sheet',
		description:
			'Explore basic svelte-bottom-sheet examples and learn common patterns for using bottom sheets in Svelte 5.'
	},
	'/docs/example-advanced': {
		title: 'Floating & Stacked Sheet Example - svelte-bottom-sheet',
		description:
			'Learn how to create and customize a floating & stacked bottom sheet using svelte-bottom-sheet.'
	},
	'/docs/migrate-v2-to-v3': {
		title: 'Migrate from v2 to v3 - svelte-bottom-sheet',
		description:
			'Follow the migration guide for upgrading svelte-bottom-sheet from version 2 to version 3.'
	}
};

export const getPageSeo = (pathname: string): PageSeo => {
	return (
		seoByPath[pathname] ?? {
			title: `${SITE_NAME} — Documentation`,
			description: DEFAULT_DESCRIPTION
		}
	);
};

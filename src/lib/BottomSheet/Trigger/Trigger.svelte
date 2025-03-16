<script lang="ts">
	import type { SheetContext, SheetIdentificationContext } from '$lib/types.js';
	import { getContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		...rest
	}: { children?: Snippet<[]> | undefined } & HTMLAttributes<HTMLDivElement> = $props();

	const sheetContext = getContext<SheetContext>('sheetContext');
	const sheetIdentificationContext = getContext<SheetIdentificationContext>(
		'sheetIdentificationContext'
	);

	if (!sheetContext) {
		throw new Error('BottomSheet.Trigger must be inside a BottomSheet component');
	}

	const handleClick = () => {
		sheetContext.toggleSheet();
	};
</script>

<div
	{...rest}
	role="button"
	tabindex="0"
	aria-haspopup="dialog"
	aria-controls={sheetIdentificationContext.sheetId}
	aria-expanded={sheetContext.isSheetOpen ? 'true' : 'false'}
	onclick={handleClick}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') handleClick();
	}}
>
	{@render children?.()}
</div>

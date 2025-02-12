<script lang="ts">
	import type { SheetContext } from '$lib/types.js';
	import { getContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		...rest
	}: { children?: Snippet<[]> | undefined } & HTMLAttributes<HTMLDivElement> = $props();

	const sheetContext = getContext<SheetContext>('sheetContext');

	if (!sheetContext) {
		throw new Error('BottomSheet.Trigger must be inside a BottomSheet component');
	}

	const handleClick = () => {
		sheetContext.toggleSheet();
	};
</script>

<div {...rest} role="button" tabindex="0" onclick={handleClick}>
	{@render children?.()}
</div>

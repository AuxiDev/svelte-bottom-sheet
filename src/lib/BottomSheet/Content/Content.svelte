<script lang="ts">
	import type { SheetContext } from '$lib/types.js';
	import { getContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	const sheetContext = getContext<SheetContext>('sheetContext');

	if (!sheetContext) {
		throw new Error('BottomSheet.Content must be inside a BottomSheet component');
	}

	let {
		children,
		...rest
	}: { children?: Snippet<[]> | undefined } & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class="bottom-sheet-content {rest.class}"
	bind:this={sheetContext.sheetContent}
	style="overflow-y: {sheetContext.isMovingSheet ? 'hidden' : 'auto'};"
	role="document"
	{...rest}
>
	{@render children?.()}
</div>

<style>
	.bottom-sheet-content {
		overflow-y: scroll;
		-ms-overflow-style: none;
		scrollbar-width: none;
		padding: 20px;
		height: 100%;
		max-width: 100%;
		flex-grow: 1;
		-webkit-overflow-scrolling: touch;
	}
</style>

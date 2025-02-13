<script lang="ts">
	import type { SheetContext } from '$lib/types.js';
	import { getContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	const sheetContext = getContext<SheetContext>('sheetContext');

	if (!sheetContext) {
		throw new Error('BottomSheet.Overlay must be inside a BottomSheet component');
	}

	let {
		children,
		...rest
	}: { children?: Snippet<[]> | undefined } & HTMLAttributes<HTMLDivElement> = $props();
</script>

{#if sheetContext.isSheetOpen}
	<div
		{...rest}
		role="presentation"
		aria-hidden="true"
		transition:fade={{ duration: 200 }}
		class="bottom-sheet-overlay {rest.class}"
	></div>
{/if}
{@render children?.()}

<style>
	.bottom-sheet-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: flex-end;
		z-index: 1;
		overflow: hidden;
	}
</style>

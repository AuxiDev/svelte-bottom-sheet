<script lang="ts">
	import type { SheetContext } from '$lib/types.js';
	import { getContext } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import type { HTMLAttributes } from 'svelte/elements';
	import { fade, slide } from 'svelte/transition';
	import Handle from '../Handle/Handle.svelte';

	const sheetContext = getContext<SheetContext>('sheetStateContext');
	if (!sheetContext) {
		throw new Error('BottomSheet.Overlay must be inside a BottomSheet component');
	}
	const { isSheetVisible } = sheetContext;

	let { children, ...rest }: { children?: any } & HTMLAttributes<HTMLDivElement> = $props();
</script>

{#if $isSheetVisible}
	<div
		{...rest}
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

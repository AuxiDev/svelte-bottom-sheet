<script lang="ts">
	import type { SheetContext } from '$lib/types.js';
	import { getContext } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import type { HTMLAttributes } from 'svelte/elements';
	import { fade, slide } from 'svelte/transition';

	const { isSheetVisible } = getContext<SheetContext>('sheetStateContext');

	let { children, ...rest } = $props<{ children?: any } & HTMLAttributes<HTMLDivElement>>();
</script>

{#if $isSheetVisible}
	<div transition:fade={{ duration: 200 }} class="bottom-sheet-overlay" {...rest}></div>
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

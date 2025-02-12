<script lang="ts">
	import type { SheetContext } from '$lib/types.js';
	import { getContext } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	const sheetContext = getContext<SheetContext>('sheetContext');

	if (!sheetContext) {
		throw new Error('BottomSheet.Overlay must be inside a BottomSheet component');
	}

	let { ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="handle-container"
	onmousemove={() => (sheetContext.isDraggingFromHandle = true)}
	ontouchmove={() => (sheetContext.isDraggingFromHandle = true)}
>
	<div {...rest} class="bottom-sheet-handle {rest.class}"></div>
</div>

<style>
	.bottom-sheet-handle {
		width: 40px;
		height: 4px;
		background-color: #e0e0e0;
		border-radius: 2px;
		margin: 16px auto;
	}
	.handle-container {
		height: 40px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>

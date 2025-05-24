<script lang="ts">
	import type { SheetContext } from '$lib/types.js';

	import { getContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	const sheetContext = getContext<SheetContext>('sheetContext');
	if (!sheetContext) throw new Error('BottomSheet.Content must be inside a BottomSheet component');

	let {
		children,
		...rest
	}: { children?: Snippet<[]> | undefined } & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class="scroll-clip"
	style={`${sheetContext.settings.position === 'left' && 'direction: rtl;'}`}
>
	<div
		{...rest}
		class="bottom-sheet-content {rest.class}"
		bind:this={sheetContext.sheetContent}
		role="document"
	>
		{@render children?.()}
	</div>
</div>

<style>
	.bottom-sheet-content {
		padding: 1.25rem;
		display: inline-block;
		direction: ltr;
	}

	.scroll-clip {
		overflow-x: auto;
		overflow-y: hidden;
		flex-grow: 1;
		direction: ltr;
	}
</style>

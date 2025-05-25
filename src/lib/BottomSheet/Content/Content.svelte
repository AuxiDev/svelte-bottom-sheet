<script lang="ts">
	import type { SheetContext } from '$lib/types.js';

	import { getContext, onMount, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	const sheetContext = getContext<SheetContext>('sheetContext');
	if (!sheetContext) throw new Error('BottomSheet.Content must be inside a BottomSheet component');

	let {
		children,
		...rest
	}: { children?: Snippet<[]> | undefined } & HTMLAttributes<HTMLDivElement> = $props();

	onMount(() => {
		// start-fit - Calculate the content fit based on the starting snappoint
		adjustFit();
	});

	const adjustFit = () => {
		const isFit = sheetContext.settings.contentAlignment === 'start-fit';
		const isHorizontal =
			sheetContext.settings.position === 'left' || sheetContext.settings.position === 'right';
		if (sheetContext.sheetContent && isFit && isHorizontal) {
			const element = sheetContext.sheetContent;
			const computedStyle = getComputedStyle(element);
			const paddingLeft = parseFloat(computedStyle.paddingLeft);
			const paddingRight = parseFloat(computedStyle.paddingRight);
			const totalWidth = element.offsetWidth;
			const contentOnlyWidth = totalWidth - paddingLeft - paddingRight;
			element.style.width = `${contentOnlyWidth}px`;
		}
	};
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
		display: inline-block;
		direction: ltr;
		padding: 1.25rem;
	}

	.scroll-clip {
		overflow-x: auto;
		overflow-y: hidden;
		flex-grow: 1;
		direction: ltr;
	}
</style>

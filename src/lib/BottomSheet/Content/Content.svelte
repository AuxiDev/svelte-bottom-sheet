<script lang="ts">
	import type { SheetContext } from '$lib/types.js';
	import { preventScroll } from '$lib/utils.js';

	import { getContext, onMount, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	const sheetContext = getContext<SheetContext>('sheetContext');
	if (!sheetContext) throw new Error('BottomSheet.Content must be inside a BottomSheet component');

	let {
		children,
		...rest
	}: { children?: Snippet<[]> | undefined } & HTMLAttributes<HTMLDivElement> = $props();
	let isScrollable = $state(false);

	const touchMoveConroller = new AbortController();
	onMount(() => {
		if (sheetContext.sheetContent) {
			sheetContext.sheetContent.scrollTop = 1;
			isScrollable = sheetContext.sheetContent.scrollTop > 0;
			sheetContext.sheetContent.scrollTop = 0;
		}

		if (!isScrollable) {
			document.addEventListener(
				'touchmove',
				(e) => preventScroll(e, sheetContext.sheetContent as HTMLDivElement),
				{
					passive: false,
					signal: touchMoveConroller.signal
				}
			);
		}

		return () => {
			touchMoveConroller.abort();
		};
	});

	/**
	 * Event which allows the background (body) not to be scrolled. Everything inside the
	 * content is allowed to be scrolled.
	 * @param event
	 */
	const stopScrollPropagationWheel = (event: WheelEvent) => {
		if (!sheetContext.sheetContent || !isScrollable) return;
		const atTop = sheetContext.sheetContent.scrollTop <= 0;
		const atBottom =
			sheetContext.sheetContent.scrollTop >=
			sheetContext.sheetContent.scrollHeight - sheetContext.sheetContent.clientHeight;

		if ((event.deltaY > 0 && !atBottom) || (event.deltaY < 0 && !atTop)) {
			event.stopPropagation();
		} else {
			event.preventDefault();
		}
	};
</script>

<div
	class="bottom-sheet-content {rest.class}"
	bind:this={sheetContext.sheetContent}
	style="overflow-y: {sheetContext.isMovingSheet ? 'hidden' : 'auto'};"
	role="document"
	onwheel={stopScrollPropagationWheel}
	{...rest}
>
	{@render children?.()}
</div>

<style>
	.bottom-sheet-content {
		overflow-y: auto;
		padding: 20px;
		height: 100%;
		max-width: 100%;
		flex-grow: 1;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior: contain;
		scrollbar-width: thin; /* Firefox special treatment */
	}
	.bottom-sheet-content::-webkit-scrollbar {
		width: 8px;
	}
	.bottom-sheet-content::-webkit-scrollbar-track {
		background: transparent;
	}
	.bottom-sheet-content::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 4px;
	}
</style>

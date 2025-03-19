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

	let touchStartY = 0;

	/**
	 * This functions finds a scrollable parent-element of the provided element within the sheet.
	 * @param element - Element which might be inside a scrollable element within the sheet
	 */
	const getScrollableElement = (element: Element) => {
		while (element && element !== document.documentElement) {
			if (!element || element.className.split(' ').includes('bottom-sheet')) {
				return;
			}
			const overflowY = window.getComputedStyle(element).overflowY;
			if (
				overflowY !== 'visible' &&
				overflowY !== 'hidden' &&
				element.scrollHeight > element.clientHeight
			) {
				return element;
			}
			element = element.parentElement as HTMLElement;
		}
		return null;
	};

	/**
	 * Event which allows only scrollable elements within the sheet to be scrolled. Everything inside the
	 * content is allowed to be scrolled.
	 * @param {TouchEvent} event - TouchEvent
	 */
	const stopScrollPropagationTouch = (event: TouchEvent) => {
		const target = event.target as Element;
		const scrollableElement = getScrollableElement(target) as HTMLElement;

		if (!scrollableElement) {
			return;
		}
		const touchMoveY = event.touches[0].clientY;
		const scrollTop = scrollableElement.scrollTop;
		const atTop = scrollTop <= 0;
		const scrollingUp = touchMoveY > touchStartY;
		if (atTop && scrollingUp) {
			sheetContext.isDraggingFromHandle = true;
			return;
		}

		event.stopPropagation();
	};

	/**
	 * Event which allows only scrollable elements within the sheet to be scrolled. Everything inside the
	 * content is allowed to be scrolled.
	 * @param {WheelEvent} event - WheelEvent
	 */
	const stopScrollPropagationWheel = (event: WheelEvent) => {
		const target = event.target as Element;
		const scrollableElement = getScrollableElement(target) as HTMLElement;

		if (!scrollableElement) {
			return;
		}

		const scrollTop = scrollableElement.scrollTop;
		const scrollHeight = scrollableElement.scrollHeight;
		const clientHeight = scrollableElement.clientHeight;

		const atTop = scrollTop <= 0;
		const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
		const scrollingUp = event.deltaY < 0;

		if ((atTop && !scrollingUp) || (atBottom && scrollingUp) || (!atTop && !atBottom)) {
			event.stopPropagation();
			return;
		}
	};
</script>

<div
	class="bottom-sheet-content {rest.class} "
	bind:this={sheetContext.sheetContent}
	style="overflow-y: {sheetContext.isMovingSheet ? 'hidden' : 'auto'};"
	role="document"
	onwheel={stopScrollPropagationWheel}
	ontouchstart={(e) => {
		touchStartY = e.touches[0].clientY;
	}}
	ontouchmove={stopScrollPropagationTouch}
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
	}
</style>

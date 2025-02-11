<script lang="ts">
	import { getContext, onMount, type Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import type { SheetContext } from '$lib/types.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		...rest
	}: { children?: Snippet<[]> | undefined } & HTMLAttributes<HTMLDivElement> = $props();

	const sheetContext = getContext<SheetContext>('sheetContext');
	if (!sheetContext) {
		throw new Error('BottomSheet.Sheet must be inside a BottomSheet component');
	}

	// svelte-ignore non_reactive_update
	let sheetElement: HTMLDivElement;

	const preventPullToRefresh = (event: TouchEvent) => {
		if (window.scrollY === 0 && event.touches[0].clientY > 50) {
			event.preventDefault();
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			sheetContext.closeSheet();
		}
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (sheetElement && !sheetElement.contains(event.target as Node)) {
			sheetContext.closeSheet();
		}
	};

	$effect(() => {
		if (sheetContext.isSheetOpen) {
			document.body.style.overflowY = 'hidden';
			document.addEventListener('touchmove', preventPullToRefresh, { passive: false });
			document.addEventListener('keydown', handleKeyDown);
			setTimeout(() => {
				document.addEventListener('click', handleClickOutside);
			}, 100);
		} else {
			document.body.style.overflowY = 'auto';
			document.removeEventListener('touchmove', preventPullToRefresh);
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

{#if sheetContext.isSheetOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		{...rest}
		bind:this={sheetElement}
		class="bottom-sheet {sheetContext.isDragging ? 'prevent-select' : ''}"
		style="height: {sheetContext.settings
			.maxHeight};  transform: translateY({sheetContext.sheetHeight}px); transition: {sheetContext.isDragging
			? ''
			: 'transform 0.3s ease-in-out'}; {rest.style} "
		role="dialog"
		ontouchstart={sheetContext.touchStartEvent}
		ontouchmove={sheetContext.touchMoveEvent}
		ontouchend={sheetContext.moveEnd}
		onmousedown={sheetContext.mouseDownEvent}
		onmousemove={sheetContext.mouseMoveEvent}
		onmouseup={sheetContext.moveEnd}
		transition:slide={{ duration: 500, easing: cubicOut }}
	>
		{@render children?.()}
	</div>
{/if}

<style>
	.prevent-select {
		-webkit-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	.bottom-sheet {
		background-color: #fff;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		justify-content: center;
		align-self: flex-end;
		width: 100%;
		max-width: 100%;
		margin: 0 auto;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		touch-action: none;
		border-radius: 16px 16px 0 0;
		z-index: 2;
	}

	.bottom-sheet-handle {
		width: 40px;
		height: 4px;
		background-color: #e0e0e0;
		border-radius: 2px;
		margin: 16px auto;
	}

	.bottom-sheet-content::-webkit-scrollbar {
		display: none;
	}
</style>

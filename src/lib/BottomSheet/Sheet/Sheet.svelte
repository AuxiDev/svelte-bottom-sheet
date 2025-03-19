<script lang="ts">
	import { getContext, onMount, type Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import type { SheetContext, SheetIdentificationContext } from '$lib/types.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		...rest
	}: { children?: Snippet<[]> | undefined } & HTMLAttributes<HTMLDivElement> = $props();

	const sheetContext = getContext<SheetContext>('sheetContext');
	const sheetIdentificationContext = getContext<SheetIdentificationContext>(
		'sheetIdentificationContext'
	);

	let previousActiveElement: HTMLElement | null;
	let axisForSlide: 'x' | 'y' =
		sheetContext.settings.position === 'left' || sheetContext.settings.position === 'right'
			? 'x'
			: 'y';

	if (!sheetContext) {
		throw new Error('BottomSheet.Sheet must be inside a BottomSheet component');
	}

	// svelte-ignore non_reactive_update
	let sheetElement: HTMLDivElement;

	const handleClickOutside = (event: MouseEvent) => {
		if (sheetElement && !sheetElement.contains(event.target as Node)) {
			sheetContext.closeSheet();
		}
	};

	const getFocusableElements = () => {
		return Array.from(
			sheetElement.querySelectorAll<HTMLElement>(
				'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
			)
		);
	};

	const handleFocusTrap = (event: KeyboardEvent) => {
		if (event.key === 'Tab') {
			const focusableElements = getFocusableElements();
			if (!focusableElements.length) return;

			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];
			const isTabPressed = !event.shiftKey;
			const isShiftTabPressed = event.shiftKey;

			if (isShiftTabPressed && document.activeElement === firstElement) {
				lastElement.focus();
				event.preventDefault();
			}

			if (isTabPressed && document.activeElement === lastElement) {
				firstElement.focus();
				event.preventDefault();
			}
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			sheetContext.closeSheet();
		}
		handleFocusTrap(event);
	};

	let transformStyle = () => {
		switch (sheetContext.settings.position) {
			case 'bottom':
				return `translateY(${sheetContext.sheetHeight}px)`;
			case 'top':
				return `translateY(-${sheetContext.sheetHeight}px)`;
			case 'left':
				return `translateX(-${sheetContext.sheetHeight}px)`;
			case 'right':
				return `translateX(${sheetContext.sheetHeight}px)`;
			default:
				return `translateY(${sheetContext.sheetHeight}px)`;
		}
	};

	let dimensionStyle = () => {
		switch (sheetContext.settings.position) {
			case 'bottom':
			case 'top':
				return `height: ${sheetContext.maxHeightPx}px;`;
			case 'left':
			case 'right':
				return `width: ${sheetContext.maxHeightPx}px; height: 100%;`;
			default:
				return `height: ${sheetContext.maxHeightPx}px;`;
		}
	};

	const preventPullToRefresh = (event: TouchEvent) => {
		if (window.scrollY === 0 && event.touches[0].clientY > 50) {
			event.preventDefault();
		}
	};

	let wheelConroller = new AbortController();
	$effect(() => {
		if (sheetContext.isSheetOpen) {
			wheelConroller = new AbortController();
			previousActiveElement = document.activeElement as HTMLElement;
			if (navigator.userAgent.toLowerCase().includes('firefox')) {
				document.body.style.overflow = 'hidden';
			}
			document.addEventListener(
				'wheel',
				(e) => {
					e.preventDefault();
				},
				{
					passive: false,
					signal: wheelConroller.signal
				}
			);

			document.addEventListener(
				'touchmove',
				(e) => {
					{
						if (e.cancelable) e.preventDefault();
					}
				},
				{
					passive: false,
					signal: wheelConroller.signal
				}
			);

			document.addEventListener('touchmove', preventPullToRefresh, { passive: false });
			document.addEventListener('keydown', handleKeyDown);
			document.body.style.touchAction = 'none';

			setTimeout(() => {
				const focusableElements = getFocusableElements();
				if (focusableElements.length) {
					focusableElements[0].focus();
				} else {
					sheetElement?.focus();
				}
				document.addEventListener('click', handleClickOutside);
			}, 100);
		} else {
			document.body.style.touchAction = 'initial';
			if (navigator.userAgent.toLowerCase().includes('firefox')) {
				document.body.style.overflow = 'auto';
			}
			wheelConroller.abort();

			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('touchmove', preventPullToRefresh);
			document.removeEventListener('keydown', handleKeyDown);
			previousActiveElement?.focus();
		}
	});
</script>

{#if sheetContext.isSheetOpen}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		{...rest}
		bind:this={sheetElement}
		class="bottom-sheet position-{sheetContext.settings.position} {sheetContext.isDragging
			? 'prevent-select'
			: ''}"
		style="{dimensionStyle()} transform: {transformStyle()}; transition: {sheetContext.isDragging
			? ''
			: 'transform 0.3s ease-in-out'}; {rest.style}"
		role="dialog"
		aria-modal="true"
		aria-labelledby={sheetIdentificationContext.headingId}
		aria-describedby={sheetIdentificationContext.descriptionId}
		id={sheetIdentificationContext.sheetId}
		tabindex="-1"
		aria-live="polite"
		ontouchstart={sheetContext.touchStartEvent}
		ontouchmove={sheetContext.touchMoveEvent}
		ontouchend={sheetContext.moveEnd}
		onmousedown={sheetContext.mouseDownEvent}
		onmousemove={sheetContext.mouseMoveEvent}
		onmouseup={sheetContext.moveEnd}
		transition:slide={{ duration: 500, easing: cubicOut, axis: axisForSlide }}
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
		z-index: 50;
		pointer-events: all;
	}

	.position-left {
		display: flex;
		flex-direction: row-reverse;
		top: 0;
		bottom: 0;
		margin: auto 0;
		border-radius: 0px 16px 16px 0px;
	}

	.position-right {
		display: flex;
		top: 0;
		bottom: 0;
		left: unset;
		right: 0;
		margin: auto 0;
		border-radius: 16px 0px 0px 16px;
	}

	.position-top {
		display: flex;
		flex-direction: column-reverse;
		border-radius: 0 0 16px 16px;
		margin: 0 auto;
		top: 0;
		bottom: unset;
	}

	.bottom-sheet-content::-webkit-scrollbar {
		display: none;
	}
</style>

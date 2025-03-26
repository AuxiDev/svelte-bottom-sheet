<script lang="ts">
	import { getContext, onMount, type Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import type { SheetContext, SheetIdentificationContext } from '$lib/types.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { slideTransition } from '$lib/utils.js';

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

	const handleClickOutside = (event: MouseEvent) => {
		if (
			sheetContext.sheetElement &&
			!sheetContext.sheetElement.contains(event.target as Node) &&
			!sheetContext.settings.disableClosing
		) {
			sheetContext.closeSheet();
		}
	};

	const getFocusableElements = () => {
		if (!sheetContext.sheetElement) return [];
		return Array.from(
			sheetContext.sheetElement.querySelectorAll<HTMLElement>(
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

	let transformStyle = () => {
		switch (sheetContext.settings.position) {
			case 'left':
				return `translateX(-${sheetContext.sheetHeight}px)`;
			case 'right':
				return `translateX(${sheetContext.sheetHeight}px)`;
			default:
				return ``;
		}
	};

	let dimensionStyle = () => {
		switch (sheetContext.settings.position) {
			case 'bottom':
			case 'top':
				return `height: 100%;  max-height: ${sheetContext.maxHeightPx - sheetContext.sheetHeight}px;`;
			case 'left':
			case 'right':
				return `width: ${sheetContext.maxHeightPx}px; height: 100%;`;
		}
	};

	/**
	 * This functions finds a scrollable parent-element of the provided element within the sheet.
	 * @param element - Element which might be inside a scrollable element within the sheet
	 */
	const getScrollableElement = (element: Element) => {
		while (element && element !== document.documentElement) {
			const overflowY = window.getComputedStyle(element).overflowY;
			if (!element || element.className.split(' ').includes('bottom-sheet')) {
				if (
					overflowY !== 'visible' &&
					overflowY !== 'hidden' &&
					element.scrollHeight > element.clientHeight
				) {
					return element;
				}
			}
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
		let atTop = scrollTop <= 0;
		const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
		let scrollingUp = event.deltaY < 0;

		if (sheetContext.settings.position === 'top') {
			atTop = scrollTop >= 0;
		} else {
			atTop = scrollTop <= 0;
			scrollingUp = !scrollingUp;
		}

		if ((atTop && scrollingUp) || (!scrollingUp && atBottom) || (!atTop && !atBottom)) {
			event.stopPropagation();
			return;
		} else if (atTop && !scrollingUp) {
			return;
		} else if (atBottom && scrollingUp) {
			return;
		}
	};

	$effect(() => {
		if (sheetContext.isSheetOpen) {
			previousActiveElement = document.activeElement as HTMLElement;
			setTimeout(() => {
				const focusableElements = getFocusableElements();
				if (focusableElements.length) {
					focusableElements[0].focus();
				} else {
					sheetContext.sheetElement?.focus();
				}
				document.addEventListener('click', handleClickOutside);
			}, 100);
		} else {
			document.removeEventListener('click', handleClickOutside);
			previousActiveElement?.focus();
		}
	});
</script>

{#if sheetContext.isSheetOpen}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		{...rest}
		bind:this={sheetContext.sheetElement}
		class="bottom-sheet position-{sheetContext.settings.position} {sheetContext.isDragging
			? 'prevent-select'
			: ''}"
		style="{dimensionStyle()}; transform: {transformStyle()}; transition: {sheetContext.isDragging
			? ''
			: 'max-height 0.3s ease'};  {rest.style}"
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
		onmouseup={sheetContext.moveEnd}
		onwheel={stopScrollPropagationWheel}
		transition:slideTransition={{
			duration: 500,
			easing: cubicOut,
			axis: axisForSlide,
			position: sheetContext.settings.position,
			sheetHeight: sheetContext.sheetHeight,
			sheetMaxHeight: sheetContext.maxHeightPx
		}}
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
		height: 100%;
		margin: 0 auto;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		overflow-y: auto;
		border-radius: 16px 16px 0 0;
		z-index: 50;
		/* -ms-overflow-style: none;
		scrollbar-width: none; */
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
		justify-content: flex-start;
	}
</style>

<script lang="ts">
	import { getContext, onMount, type Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import type { SheetContext, SheetIdentificationContext } from '$lib/types.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getScrollableElement, measurementToPx, slideTransition } from '$lib/utils.js';

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

	let didDrag = false;
	let suppressNextClick = false;
	let startX = 0;
	let startY = 0;

	const DRAG_THRESHOLD = 5;

	// Added these events so we know when you drag out of the window and release (for example taskbar)
	const handleMouseDown = (event: MouseEvent) => {
		startX = event.clientX;
		startY = event.clientY;
		didDrag = false;

		sheetContext.mouseDownEvent(event);

		window.addEventListener('mousemove', handleMouseMove, true);
		window.addEventListener('mouseup', handleMouseUp, true);
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (
			Math.abs(event.clientX - startX) > DRAG_THRESHOLD ||
			Math.abs(event.clientY - startY) > DRAG_THRESHOLD
		) {
			didDrag = true;
		}
	};

	const handleMouseUp = (event: MouseEvent) => {
		window.removeEventListener('mousemove', handleMouseMove, true);
		window.removeEventListener('mouseup', handleMouseUp, true);

		if (didDrag) {
			suppressNextClick = true;
		}

		sheetContext.moveEnd();
	};

	const handleClickOutside = (event: MouseEvent) => {
		// Suppress click caused by drag-outside
		if (suppressNextClick) {
			suppressNextClick = false;
			return;
		}

		if (
			sheetContext.sheetHeight >
			measurementToPx(sheetContext.settings.maxDragPoint, sheetContext.maxHeightPx)
		) {
			sheetContext.moveEnd();
			return;
		}

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
		if (event.key !== 'Tab') return;

		const focusableElements = getFocusableElements();
		if (!focusableElements.length) return;

		const first = focusableElements[0];
		const last = focusableElements[focusableElements.length - 1];

		if (event.shiftKey && document.activeElement === first) {
			last.focus();
			event.preventDefault();
		} else if (!event.shiftKey && document.activeElement === last) {
			first.focus();
			event.preventDefault();
		}
	};

	/**
	 * Return the additional needed styles for the different positions.
	 */
	const dimensionStyle = () => {
		switch (sheetContext.settings.position) {
			case 'bottom':
			case 'top':
				return `height: 100%;  max-height: ${sheetContext.maxHeightPx - sheetContext.sheetHeight}px`;
			case 'left':
			case 'right':
				return `height: 100%; width: 100%; max-width: ${sheetContext.maxHeightPx - sheetContext.sheetHeight}px`;
		}
	};

	/**
	 * Returns a CSS transition string based on the slide axis.
	 */
	const transitionStyle = () => {
		if (!sheetContext.isDragging && axisForSlide === 'x') {
			return 'transition: max-width 0.3s ease';
		} else if (!sheetContext.isDragging && axisForSlide === 'y') {
			return 'transition: max-height 0.3s ease';
		}
	};

	/**
	 * Event which allows only scrollable elements within the sheet to be scrolled. Everything inside the
	 * content is allowed to be scrolled.
	 * @param {WheelEvent} event - WheelEvent
	 */
	const stopScrollPropagationWheel = (event: WheelEvent) => {
		const target = event.target as Element;
		const scrollableElement = getScrollableElement(target) as HTMLElement;
		if (!scrollableElement || axisForSlide === 'x') {
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
				const autofocusedElement = focusableElements.find((element) =>
					element.matches('[autofocus], [data-autofocus]')
				);
				if (autofocusedElement) {
					autofocusedElement.focus();
				} else if (focusableElements.length) {
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
		class="bottom-sheet position-{sheetContext.settings.position} {sheetContext.isDragging &&
			'prevent-select'} {rest.class}"
		style="{dimensionStyle()};  {transitionStyle()}; {rest.style}"
		role="dialog"
		aria-modal="true"
		aria-labelledby={sheetIdentificationContext.headingId}
		aria-describedby={sheetIdentificationContext.descriptionId}
		id={sheetIdentificationContext.sheetId}
		tabindex="-1"
		aria-live="polite"
		onkeydown={handleFocusTrap}
		ontouchstart={sheetContext.touchStartEvent}
		ontouchmove={sheetContext.touchMoveEvent}
		ontouchend={sheetContext.moveEnd}
		onmousedown={handleMouseDown}
		onwheel={stopScrollPropagationWheel}
		transition:slideTransition={{
			duration: 500,
			easing: cubicOut,
			axis: axisForSlide,
			position: sheetContext.settings.position,
			sheetHeight: sheetContext.maxHeightPx
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
		overscroll-behavior: contain;
		background-color: #fff;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		justify-content: center;
		align-self: flex-end;
		margin: 0 auto;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		overflow-y: auto;
		border-radius: 1rem 1rem 0 0;
		z-index: 50;
	}

	.position-left {
		display: flex;
		flex-direction: row-reverse;
		top: 0;
		margin: auto 0;
		border-radius: 0 1rem 1rem 0;
		width: 100%;
	}

	.position-right {
		display: flex;
		top: 0;
		left: unset;
		right: 0;
		margin: auto 0;
		border-radius: 1rem 0 0 1rem;
	}

	.position-top {
		display: flex;
		flex-direction: column-reverse;
		border-radius: 0 0 1rem rem;
		margin: 0 auto;
		top: 0;
		bottom: unset;
		justify-content: flex-start;
	}
</style>

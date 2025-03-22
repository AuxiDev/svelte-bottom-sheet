<script lang="ts">
	import { getContext, onMount, type Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import type { SheetContext, SheetIdentificationContext } from '$lib/types.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { slideTransition } from '$lib/utils.js';
	import { slide } from 'svelte/transition';

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

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && !sheetContext.settings.disableClosing) {
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

	let isAnimation = $state(false);
	let sheetScrollPosition = 0;

	$effect(() => {
		if (!sheetContext.isMovingSheet && sheetContext.sheetElement !== null) {
			sheetScrollPosition = sheetContext.sheetElement.scrollTop as number;
			isAnimation = true;

			setTimeout(() => {
				isAnimation = false;
			}, 500);

			setTimeout(() => {
				if (sheetContext.sheetElement) {
					sheetContext.sheetElement.scrollTop = sheetScrollPosition;
				}
			}, 100);
		}
	});

	let heightHistory = [0, 0];
	let sheetHeightHistory = [0, 0];

	let dimensionStyle = () => {
		switch (sheetContext.settings.position) {
			case 'bottom':
			case 'top': {
				/* When you have got a sheet with snappoint, you still want to be able to scroll it when it's not at the very top, were usually the default scroll behaviour 
				would apply (duo to max-height). Therefore, we adjust the height to be as much as the user can see. 
				Because this ruins the animation, we have to push it up or down, and through the animation add for a short period (time of the animation, 500ms) 
				some more content so there aren't any gaps.
				*/
				const isBottom = sheetContext.settings.position === 'bottom';

				if (!isAnimation) {
					heightHistory = [heightHistory[1], sheetContext.maxHeightPx - sheetContext.sheetHeight];
					sheetHeightHistory = [sheetHeightHistory[1], sheetContext.sheetHeight];
				}

				const height =
					isAnimation && heightHistory[1] < heightHistory[0] ? heightHistory[0] : heightHistory[1];
				const offset =
					isAnimation && heightHistory[1] < heightHistory[0]
						? sheetHeightHistory[0]
						: sheetHeightHistory[1];

				return isBottom
					? `height: ${height}px; margin-bottom: ${offset}px;`
					: `height: ${height}px; margin-top: ${offset}px;`;
			}

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
		const atTop = scrollTop <= 0;
		const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
		const scrollingUp = event.deltaY < 0;
		if ((atTop && !scrollingUp) || (atBottom && scrollingUp) || (!atTop && !atBottom)) {
			event.stopPropagation();
			return;
		}
	};

	let wheelConroller = new AbortController();
	$effect(() => {
		if (sheetContext.isSheetOpen) {
			previousActiveElement = document.activeElement as HTMLElement;
			if (navigator.userAgent.toLowerCase().includes('firefox')) {
				document.body.style.overflow = 'hidden';
			}

			wheelConroller = new AbortController();
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
					sheetContext.sheetElement?.focus();
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
		bind:this={sheetContext.sheetElement}
		class="bottom-sheet position-{sheetContext.settings.position} {sheetContext.isDragging
			? 'prevent-select'
			: ''}"
		style="{dimensionStyle()} transform: {transformStyle()}; transition: {sheetContext.isDragging
			? ''
			: 'transform 0.3s ease-in-out'}; overflow-y: {sheetContext.isMovingSheet
			? 'hidden'
			: 'auto'};  {rest.style}"
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

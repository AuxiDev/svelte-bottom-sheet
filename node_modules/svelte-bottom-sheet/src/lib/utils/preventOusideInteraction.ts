/**
 * Prevents page scrolling while allowing scrollable content
 * inside the sheet to scroll normally.
 */
export const preventScroll = (element: HTMLElement) => {
	const isInsideSheet = (target: EventTarget | null) =>
		target instanceof Node && element.contains(target);

	const canScroll = (target: EventTarget | null, deltaX: number, deltaY: number) => {
		if (!(target instanceof Element)) return false;

		let current: Element | null = target;

		while (current && element.contains(current)) {
			const style = getComputedStyle(current);
			const canScrollY =
				/(auto|scroll|overlay)/.test(style.overflowY) &&
				current.scrollHeight > current.clientHeight;

			const canScrollX =
				/(auto|scroll|overlay)/.test(style.overflowX) && current.scrollWidth > current.clientWidth;

			if ((deltaY !== 0 && canScrollY) || (deltaX !== 0 && canScrollX)) {
				return true;
			}

			current = current.parentElement;
		}

		return false;
	};

	const onWheel = (event: WheelEvent) => {
		if (!isInsideSheet(event.target)) {
			event.preventDefault();
			return;
		}

		if (!canScroll(event.target, event.deltaX, event.deltaY)) {
			event.preventDefault();
		}
	};

	const onTouchMove = (event: TouchEvent) => {
		if (!isInsideSheet(event.target)) {
			event.preventDefault();
		}
	};

	document.addEventListener('wheel', onWheel, {
		capture: true,
		passive: false
	});

	document.addEventListener('touchmove', onTouchMove, {
		capture: true,
		passive: false
	});

	return () => {
		document.removeEventListener('wheel', onWheel, true);
		document.removeEventListener('touchmove', onTouchMove, true);
	};
};

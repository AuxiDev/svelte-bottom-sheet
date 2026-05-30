/**
 * Prevents scrolling outside of a specific element and prevents
 * scroll chaining when the element itself reaches its bounds.
 */
export const preventScroll = (element: HTMLElement) => {
	const isOutside = (target: EventTarget | null) =>
		target instanceof Node && !element.contains(target);

	const onScrollBlock = (e: Event) => {
		if (isOutside(e.target)) {
			e.preventDefault();
		}
	};

	let lastTouchY = 0;

	const preventScrollChaining = (e: WheelEvent | TouchEvent) => {
		const { scrollTop, scrollHeight, clientHeight } = element;
		let deltaY = 0;
		if (e instanceof WheelEvent) {
			deltaY = e.deltaY;
		} else if (e instanceof TouchEvent) {
			const touch = e.touches[0];
			deltaY = lastTouchY - touch.clientY;
			lastTouchY = touch.clientY;
		}
		const atTop = scrollTop === 0;
		const atBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
		if ((atTop && deltaY < 0) || (atBottom && deltaY > 0)) {
			if (e.cancelable) e.preventDefault();
		}
	};

	const updateTouchY = (e: TouchEvent) => {
		lastTouchY = e.touches[0].clientY;
	};

	document.addEventListener('wheel', onScrollBlock, { capture: true, passive: false });
	document.addEventListener('touchmove', onScrollBlock, { capture: true, passive: false });

	element.addEventListener('touchstart', updateTouchY, { passive: true });
	element.addEventListener('wheel', preventScrollChaining, { passive: false });
	element.addEventListener('touchmove', preventScrollChaining, { passive: false });

	return function cleanup() {
		document.removeEventListener('wheel', onScrollBlock, true);
		document.removeEventListener('touchmove', onScrollBlock, true);

		element.removeEventListener('touchstart', updateTouchY);
		element.removeEventListener('wheel', preventScrollChaining);
		element.removeEventListener('touchmove', preventScrollChaining);
	};
};

/**
 * Converts a measurement value into pixels relative to the `maxHeight`.
 * - If the value is ≤ 1, it represents a percentage of `maxHeight`.
 * - If the value is > 1, it is treated as an absolute pixel value.
 *
 * @param {number} measurement - The measurement value.
 * @param {number} maxHeightPx - The maximum height in pixel.
 * @returns {number} The calculated pixel value.
 */
export const measurementToPx = (measurement: number, maxHeightPx: number) => {
	if (measurement > 1) {
		return maxHeightPx - measurement;
	} else {
		return maxHeightPx - measurement * maxHeightPx;
	}
};

/**
 * Prevents scrolling
 *
 * @param {Event} event - TouchMove / Wheel Event where the behaviour should be blocked.
 * @param {Element} element - Element which should contain the event target
 */
export const preventScroll = (event: Event, element: Element) => {
	if (element && !element.contains(event.target as Node)) {
		event.preventDefault();
	}

	if (
		((event.target as Element).className &&
			(event.target as Element).className.startsWith('bottom-sheet')) ||
		recursiveParentCheck(event.target as Element, 'bottom-sheet')
	) {
		if (recursiveParentCheck(event.target as Element, 'scrollable')) {
			return;
		}
		event.preventDefault();
	}
};

export const recursiveParentCheck = (target: Element, targetClass: string): boolean => {
	if (target.parentElement?.className.split(' ').includes(targetClass)) {
		return true;
	} else if (target.parentElement !== null) {
		return recursiveParentCheck(target.parentElement, targetClass);
	}

	return false;
};

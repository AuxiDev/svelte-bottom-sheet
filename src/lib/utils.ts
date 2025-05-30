import { cubicOut } from 'svelte/easing';
import type { sheetPosition } from './types.js';

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
 * Searches up to a element with a `bottom-sheet`-class to look up if there is any scrollable element
 * @param {Element} element - A element in the `bottom-sheet`-class
 * @returns {Element | null} The scrollable element, or null if not found.
 */
export const getScrollableElement = (element: Element): Element | null => {
	while (element && element !== document.documentElement) {
		const style = window.getComputedStyle(element);
		const overflowY = style.overflowY;
		const overflowX = style.overflowX;
		const hasScrollableY =
			overflowY !== 'visible' &&
			overflowY !== 'hidden' &&
			element.scrollHeight > element.clientHeight;
		const hasScrollableX =
			overflowX !== 'visible' &&
			overflowX !== 'hidden' &&
			element.scrollWidth > element.clientWidth;

		if (
			element.className.split(' ').includes('bottom-sheet') &&
			(hasScrollableY || hasScrollableX)
		) {
			return element;
		}

		if (hasScrollableY || hasScrollableX) {
			return element;
		}

		element = element.parentElement as HTMLElement;
	}
	return null;
};

/**
 * Slides an element in and out.
 *
 * @param {Element} node
 * @param {SlideParams} [params]
 * @param {sheetPosition} position
 * @returns {TransitionConfig}
 */
export const slideTransition = (
	node: HTMLElement,
	{
		delay = 0,
		duration = 400,
		easing = cubicOut,
		axis = 'y',
		position = 'bottom',
		sheetHeight = 0
	}: {
		delay?: number;
		duration?: number;
		easing?: (t: number) => number;
		axis?: 'x' | 'y';
		position: sheetPosition;
		sheetHeight: number;
	}
) => {
	const style: any = getComputedStyle(node);

	if (sheetHeight === 0) {
		sheetHeight = node.offsetHeight;
	}

	const negativeTranslate = position == 'top' || position == 'left';
	const opacity = parseFloat(style.opacity);
	const primary_property = axis === 'y' ? 'translateY' : 'translateX';
	const primary_distance = sheetHeight;
	const secondary_properties = axis === 'y' ? ['top', 'bottom'] : ['left', 'right'];
	const capitalized_secondary_properties = secondary_properties.map(
		(e) => `${e[0].toUpperCase()}${e.slice(1)}` as 'Left' | 'Right' | 'Top' | 'Bottom'
	);
	const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
	const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
	const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
	const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
	const border_width_start_value = parseFloat(
		style[`border${capitalized_secondary_properties[0]}Width`]
	);
	const border_width_end_value = parseFloat(
		style[`border${capitalized_secondary_properties[1]}Width`]
	);

	return {
		delay,
		duration,
		easing,
		css: (t: number) => `
            overflow: hidden;
            opacity: ${Math.min(t * 20, 1) * opacity};
            transform: ${primary_property}(${(1 - t) * (negativeTranslate ? -1 : 1) * primary_distance}px);
            padding-${secondary_properties[0]}: ${t * padding_start_value}px;
            padding-${secondary_properties[1]}: ${t * padding_end_value}px;
            margin-${secondary_properties[0]}: ${t * margin_start_value}px;
            margin-${secondary_properties[1]}: ${t * margin_end_value}px;
            border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;
            border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;
        `
	};
};

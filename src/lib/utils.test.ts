// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { getScrollableElement, measurementToPx, resolveSettings } from './utils.js';

describe('measurementToPx', () => {
	it('converts proportional and absolute measurements to hidden distance', () => {
		expect(measurementToPx(0.25, 400)).toBe(300);
		expect(measurementToPx(100, 400)).toBe(300);
		expect(measurementToPx(1, 400)).toBe(0);
	});
});

describe('resolveSettings', () => {
	it('returns complete defaults with an independent snap point array', () => {
		const first = resolveSettings();
		const second = resolveSettings();

		expect(first).toMatchObject({
			maxHeight: 0.7,
			snapPoints: [1],
			startingSnapPoint: 1,
			position: 'bottom'
		});
		expect(first.snapPoints).not.toBe(second.snapPoints);
	});

	it('adds the fully open point without mutating consumer settings', () => {
		const snapPoints = [0.25, 0.5];
		const settings = { snapPoints, maxHeight: 500 };

		const resolved = resolveSettings(settings);

		expect(resolved.snapPoints).toEqual([0.25, 0.5, 1]);
		expect(resolved.maxHeight).toBe(500);
		expect(snapPoints).toEqual([0.25, 0.5]);
		expect(resolved.snapPoints).not.toBe(snapPoints);
	});
});

describe('getScrollableElement', () => {
	it('walks safely through SVG elements and finds a scrollable ancestor', () => {
		const scrollContainer = document.createElement('div');
		scrollContainer.style.overflowY = 'auto';
		Object.defineProperties(scrollContainer, {
			scrollHeight: { value: 200 },
			clientHeight: { value: 100 }
		});

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		scrollContainer.append(svg);
		document.body.append(scrollContainer);

		expect(getScrollableElement(svg)).toBe(scrollContainer);
	});

	it('returns null when no ancestor can scroll', () => {
		const child = document.createElement('span');
		document.body.append(child);

		expect(getScrollableElement(child)).toBeNull();
	});
});

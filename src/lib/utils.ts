/**
 * Converts a measurement value into pixels relative to the `maxHeight`.
 * - If the value is ≤ 1, it represents a percentage of `maxHeight`.
 * - If the value is > 1, it is treated as an absolute pixel value.
 *
 * @param {number} measurement - The measurement value.
 * @returns {number} The calculated pixel value.
 */
export const measurementToPx = (measurement: number, maxHeightPx: number) => {
	if (measurement > 1) {
		return maxHeightPx - measurement;
	} else {
		return maxHeightPx - measurement * maxHeightPx;
	}
};

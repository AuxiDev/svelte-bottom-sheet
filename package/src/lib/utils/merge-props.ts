/**
 * Converts a style object into a CSS string.
 * Handles camelCase to kebab-case conversion.
 */
const stringifyStyle = (style: Record<string, any> | string | undefined): string => {
	if (!style) return '';
	if (typeof style === 'string') return style;

	return Object.entries(style)
		.filter(([_, v]) => v !== undefined && v !== null && v !== false)
		.map(([k, v]) => {
			const key = k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
			return `${key}:${v}`;
		})
		.join(';');
};

/**
 * Merges multiple props objects together.
 **/
export const mergeProps = <T extends Record<string | symbol, any>[]>(
	...args: T
): Record<string | symbol, any> => {
	const result: Record<string | symbol, any> = {};

	for (const props of args) {
		if (!props) continue;

		for (const key of Reflect.ownKeys(props)) {
			const argValue = props[key];
			const resultValue = result[key];

			if (
				typeof key === 'string' &&
				key.startsWith('on') &&
				typeof argValue === 'function' &&
				typeof resultValue === 'function'
			) {
				result[key] = (...eventArgs: any[]) => {
					resultValue(...eventArgs);
					argValue(...eventArgs);
				};
			} else if (
				typeof key === 'symbol' &&
				typeof argValue === 'function' &&
				typeof resultValue === 'function'
			) {
				result[key] = (node: HTMLElement) => {
					const cleanup1 = resultValue(node);
					const cleanup2 = argValue(node);

					return {
						destroy() {
							if (cleanup1 && typeof cleanup1.destroy === 'function') cleanup1.destroy();
							if (cleanup2 && typeof cleanup2.destroy === 'function') cleanup2.destroy();
						}
					};
				};
			} else if (
				(key === 'class' || key === 'className') &&
				typeof argValue === 'string' &&
				typeof resultValue === 'string'
			) {
				result[key] = `${resultValue} ${argValue}`.trim();
			} else if (key === 'style') {
				if (typeof resultValue === 'string' || typeof argValue === 'string') {
					const s1 = stringifyStyle(resultValue);
					const s2 = stringifyStyle(argValue);
					result[key] = [s1, s2].filter(Boolean).join(';').replace(/;;+/g, ';');
				} else if (typeof resultValue === 'object' && typeof argValue === 'object') {
					result[key] = { ...resultValue, ...argValue };
				} else {
					result[key] = argValue;
				}
			} else {
				result[key] = argValue;
			}
		}
	}

	if (result.style && typeof result.style === 'object') {
		result.style = stringifyStyle(result.style);
	}

	return result;
};

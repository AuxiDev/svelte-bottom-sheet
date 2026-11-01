import { tick } from 'svelte';

export const FOCUSABLE_SELECTOR =
	'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const focusUtils = {
	/**
	 * Get all focusable elements within a container
	 */
	getElements(container: HTMLElement | Document, selector = FOCUSABLE_SELECTOR): HTMLElement[] {
		return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
			(el) => el.offsetParent !== null && !el.hasAttribute('disabled')
		);
	},

	/**
	 * Trap focus within a container.
	 * Works even if the container has no focusable children.
	 */
	async trap(
		container: HTMLElement,
		options: {
			selector?: string;
			autoFocus?: boolean;
			restoreFocus?: boolean;
		} = {}
	) {
		const { selector = FOCUSABLE_SELECTOR, autoFocus = true, restoreFocus = true } = options;

		if (!container) return () => {};

		const previouslyFocused = document.activeElement as HTMLElement | null;
		const hadTabIndex = container.hasAttribute('tabindex');

		if (!hadTabIndex) {
			container.setAttribute('tabindex', '-1');
		}

		await tick();

		const getItems = () => this.getElements(container, selector);

		if (autoFocus) {
			const items = getItems();
			(items[0] ?? container).focus({ preventScroll: true });
		}

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key !== 'Tab') return;

			const items = getItems();

			if (items.length === 0) {
				e.preventDefault();
				container.focus({ preventScroll: true });
				return;
			}

			const first = items[0];
			const last = items[items.length - 1];
			const active = document.activeElement as HTMLElement;

			if (e.shiftKey) {
				if (active === first || !container.contains(active)) {
					e.preventDefault();
					last.focus({ preventScroll: true });
				}
			} else {
				if (active === last) {
					e.preventDefault();
					first.focus({ preventScroll: true });
				}
			}
		};

		container.addEventListener('keydown', onKeyDown);

		return () => {
			container.removeEventListener('keydown', onKeyDown);

			if (!hadTabIndex) {
				container.removeAttribute('tabindex');
			}

			if (restoreFocus) {
				previouslyFocused?.focus({ preventScroll: true });
			}
		};
	},

	/**
	 * Automatically focus the first or last focusable element in a container
	 */
	auto(
		containerOrSelector: HTMLElement | string,
		options: {
			selector?: string;
			select?: 'first' | 'last';
		} = {}
	) {
		const { selector = FOCUSABLE_SELECTOR, select = 'first' } = options;

		const container =
			typeof containerOrSelector === 'string'
				? document.querySelector<HTMLElement>(containerOrSelector)
				: containerOrSelector;

		if (!container) return;
		const items = this.getElements(container, selector);
		if (items.length === 0) return;

		const target = select === 'first' ? items[0] : items[items.length - 1];
		target?.focus({ preventScroll: true });
	},

	/**
	 * Logic to move focus
	 */
	shift(params: {
		current: HTMLElement;
		dir: 1 | -1 | 'home' | 'end';
		container: HTMLElement;
		selector?: string;
		loop?: boolean;
		onShift?: (next: HTMLElement, prev: HTMLElement) => void;
	}) {
		const { current, dir, container, selector = FOCUSABLE_SELECTOR, loop = true, onShift } = params;

		const items = Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
			(el) =>
				!el.hasAttribute('disabled') &&
				el.getAttribute('aria-disabled') !== 'true' &&
				!el.hasAttribute('data-disabled')
		);
		if (items.length === 0) return;

		let nextIdx: number;

		if (dir === 'home') nextIdx = 0;
		else if (dir === 'end') nextIdx = items.length - 1;
		else {
			const currentIndex = items.indexOf(current);
			nextIdx = currentIndex + dir;

			if (loop) nextIdx = (nextIdx + items.length) % items.length;
			else nextIdx = Math.max(0, Math.min(nextIdx, items.length - 1));
		}

		const next = items[nextIdx];
		if (!next) return;

		next.focus({ preventScroll: true });

		onShift?.(next, current);
	},

	/**
	 * Use this in your onkeydown handlers.
	 */
	handleRoving(
		e: KeyboardEvent,
		options: {
			root: string;
			item: string;
			loop?: boolean;
			onShift?: (next: HTMLElement, prev: HTMLElement) => void;
		}
	) {
		const { root, item, loop = true, onShift } = options;

		const map: Record<string, 1 | -1 | 'home' | 'end'> = {
			ArrowDown: 1,
			ArrowRight: 1,
			ArrowUp: -1,
			ArrowLeft: -1,
			Home: 'home',
			End: 'end'
		};

		const dir = map[e.key];
		if (!dir) return;

		const current = e.currentTarget as HTMLElement;
		const container = current.closest(root) as HTMLElement;
		if (!container) return;

		e.preventDefault();

		focusUtils.shift({
			current,
			dir,
			container,
			selector: item,
			loop,
			onShift
		});
	}
};

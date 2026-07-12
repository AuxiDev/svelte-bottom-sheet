// @vitest-environment jsdom

import { mount, tick, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import BottomSheetFixture from './BottomSheet.test.svelte';

class ResizeObserverStub {
	observe() {}
	disconnect() {}
}

describe('BottomSheet lifecycle', () => {
	let target: HTMLDivElement;

	beforeEach(() => {
		vi.stubGlobal('ResizeObserver', ResizeObserverStub);
		target = document.createElement('div');
		document.body.append(target);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		target.remove();
	});

	it('emits open and close callbacks only for actual state transitions', async () => {
		const onopen = vi.fn();
		const onclose = vi.fn();
		const component = mount(BottomSheetFixture, { target, props: { onopen, onclose } });
		const trigger = target.querySelector<HTMLElement>('[role="button"]');

		expect(trigger).not.toBeNull();
		expect(onclose).not.toHaveBeenCalled();

		trigger?.click();
		await tick();
		expect(onopen).toHaveBeenCalledOnce();

		trigger?.click();
		await tick();
		expect(onclose).toHaveBeenCalledOnce();

		await unmount(component);
	});

	it('does not enter a dragging state when dragging is disabled', async () => {
		const component = mount(BottomSheetFixture, {
			target,
			props: { settings: { disableDragging: true } }
		});

		target.querySelector<HTMLElement>('[role="button"]')?.click();
		await tick();
		const sheet = target.querySelector<HTMLElement>('[role="dialog"]');
		sheet?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
		await tick();

		expect(sheet?.classList.contains('prevent-select')).toBe(false);
		await unmount(component);
	});

	it('cancels delayed outside-click setup when closed immediately', async () => {
		vi.useFakeTimers();
		const addEventListener = vi.spyOn(document, 'addEventListener');
		const component = mount(BottomSheetFixture, { target });
		const trigger = target.querySelector<HTMLElement>('[role="button"]');
		const initialClickListenerCount = addEventListener.mock.calls.filter(
			([event]) => event === 'click'
		).length;

		trigger?.click();
		await tick();
		trigger?.click();
		await tick();
		await vi.advanceTimersByTimeAsync(150);

		expect(addEventListener.mock.calls.filter(([event]) => event === 'click')).toHaveLength(
			initialClickListenerCount
		);
		await unmount(component);
	});
});

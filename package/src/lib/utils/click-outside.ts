export const clickOutside = (node: HTMLElement, callback: (event: MouseEvent) => void) => {
	let pointerId: number | null = null;
	let startedOutside = false;

	const reset = () => {
		pointerId = null;
		startedOutside = false;
	};

	const onPointerDown = (event: PointerEvent) => {
		if (!event.isPrimary || event.button !== 0) return;

		pointerId = event.pointerId;
		startedOutside = !node.contains(event.target as Node);
	};

	const onPointerCancel = (event: PointerEvent) => {
		if (event.pointerId === pointerId) reset();
	};

	const onClick = (event: MouseEvent) => {
		if (pointerId === null) return;

		const target = event.target;
		const shouldCall =
			startedOutside &&
			target instanceof Node &&
			!node.contains(target) &&
			!event.defaultPrevented &&
			event.detail !== 0;

		reset();

		if (shouldCall) callback(event);
	};

	document.addEventListener('pointerdown', onPointerDown, true);
	document.addEventListener('pointercancel', onPointerCancel, true);
	document.addEventListener('click', onClick);

	return () => {
		document.removeEventListener('pointerdown', onPointerDown, true);
		document.removeEventListener('pointercancel', onPointerCancel, true);
		document.removeEventListener('click', onClick);
	};
};

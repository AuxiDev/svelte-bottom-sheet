export const handleEscapeKey = (callback: (event: KeyboardEvent) => void) => {
	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key !== 'Escape' || event.defaultPrevented) return;

		callback(event);
	};

	document.addEventListener('keydown', onKeyDown);

	return () => {
		document.removeEventListener('keydown', onKeyDown);
	};
};

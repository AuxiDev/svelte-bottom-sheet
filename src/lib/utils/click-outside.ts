// Check if the mouseDown happened inside the sheet, because else if you drag and release outside of the sheet it would trigger
export const clickOutside = (node: HTMLElement, callback: (event: MouseEvent) => void) => {
	let startedInside = false;
	let endedInside = false;

	const handleMouseDown = (event: MouseEvent) => {
		startedInside = node && node.contains(event.target as Node);
	};

	const handleMouseUp = (event: MouseEvent) => {
		endedInside = node && node.contains(event.target as Node);
	};

	const handleClick = (event: MouseEvent) => {
		if (startedInside || endedInside) {
			return;
		}

		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			callback(event);
		}
	};

	document.addEventListener('mousedown', handleMouseDown, true);
	document.addEventListener('mouseup', handleMouseUp, true);
	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('mousedown', handleMouseDown, true);
			document.removeEventListener('mouseup', handleMouseUp, true);
			document.removeEventListener('click', handleClick, true);
		}
	};
};

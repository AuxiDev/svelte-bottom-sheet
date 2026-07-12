Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener() {},
		removeEventListener() {},
		dispatchEvent: () => false
	})
});

Object.defineProperty(Element.prototype, 'animate', {
	writable: true,
	value: () => ({
		cancel() {},
		finish() {},
		play() {},
		pause() {},
		reverse() {},
		currentTime: 0,
		finished: Promise.resolve()
	})
});

<script>
	let scrollTarget; // Will hold the reference to the scrollable div
	let lastY = 0;

	function handleTouchStart(e) {
		lastY = e.touches[0].clientY;
	}

	function handleTouchMove(e) {
		const currentY = e.touches[0].clientY;
		const deltaY = lastY - currentY;

		if (scrollTarget) {
			// Inject the scroll delta into the target element
			scrollTarget.scrollTop += deltaY;
		}

		lastY = currentY;

		// Prevent standard window/viewport bounce
		if (e.cancelable) {
			e.preventDefault();
		}
	}
</script>

<!-- Touch Zone capturing the gesture -->
<!-- Note the new Svelte 5 event attribute syntax -->
<div class="touch-zone" ontouchstart={handleTouchStart} ontouchmove={handleTouchMove}>
	Touch and drag here to scroll the box below
</div>

<!-- The Target Box being programmatically scrolled -->
<div class="scroll-container" bind:this={scrollTarget}>
	<div class="large-content">
		Lots of content here... Davids would write the smartest content for this.
		{#each Array(20) as _, i}
			<p>Row {i + 1}: Scrolling injected successfully.</p>
		{/each}
	</div>
</div>

<style>
	.touch-zone {
		padding: 2rem;
		background: #f0f0f0;
		text-align: center;
		border: 2px dashed #ccc;
		margin-bottom: 1rem;
		user-select: none;
	}
	.scroll-container {
		height: 150px;
		overflow-y: auto;
		border: 1px solid #333;
	}
	.large-content {
		padding: 1rem;
	}
</style>

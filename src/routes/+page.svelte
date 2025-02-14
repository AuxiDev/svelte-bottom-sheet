<script lang="ts">
	import BottomSheet from '$lib/BottomSheet/index.js';
	import BottomSheet2 from '$lib/BottomSheet/BottomSheet.svelte';
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';

	let isBasicSheetOpen = $state(false);
	let isSnapPointsSheetOpen = $state(false);
	let isEventsSheetOpen = $state(false);
	let eventLog = $state<string[]>([]);
	let isLongListSheetOpen = $state(false);

	let snapPointsSheet: BottomSheet2;

	$effect(() => {
		if (isSnapPointsSheetOpen) {
			//snapPointsSheet.setSnapPoint(25);
		}
	});
	const logEvent = async (event: string) => {
		await tick();
		eventLog = [...eventLog, `${new Date().toLocaleTimeString()}: ${event}`];

		if (eventLog.length > 10) eventLog.shift();
	};
</script>

<div class="background-decor">
	<div class="wave one"></div>
	<div class="wave two"></div>

	<div class="shape dots"></div>
	<div class="shape dots"></div>
	<div class="shape dots"></div>
	<div class="shape lines"></div>
	<div class="shape circle"></div>
	<div class="shape square"></div>
</div>

<div class="social-container">
	<a
		href="https://github.com/AuxiDev/svelte-bottom-sheet"
		aria-label="SvelteBottomSheet GitHub Repository"
		class="href"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-github"
			><path
				d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
			/><path d="M9 18c-4.51 2-5-2-7-2" /></svg
		></a
	>
</div>

<main>
	<h1>Bottom Sheet Preview</h1>
	<p class="intro">
		Explore the interactive bottom sheets with smooth transitions, snap points, and event tracking.
		A simple and effective way to present content in an engaging way.
	</p>

	<section class="showcase basic">
		<h2>Basic Bottom Sheet</h2>
		<p>
			The Basic Bottom Sheet provides a clean and simple interaction. It slides up smoothly from the
			bottom of the screen, allowing users to quickly access additional content or actions without
			overwhelming them.
		</p>
		<button onclick={() => (isBasicSheetOpen = true)}>Open Bottom Sheet</button>
		<BottomSheet bind:isSheetOpen={isBasicSheetOpen}>
			<BottomSheet.Overlay>
				<BottomSheet.Sheet style="max-width: 600px;">
					<BottomSheet.Handle />
					<BottomSheet.Content>
						<h3>Basic Bottom Sheet</h3>
						<p>
							This sheet allows for basic interactions. It slides up smoothly, and you can either
							drag it down to close or tap outside to dismiss. No complicated features, just the
							essentials.
						</p>
						<ul>
							<li>No snap points, so it's free to slide anywhere!</li>
							<li>Smooth transitions that feel natural and seamless</li>
							<li>Perfect for displaying quick information or performing simple actions</li>
						</ul>
					</BottomSheet.Content>
				</BottomSheet.Sheet>
			</BottomSheet.Overlay>
		</BottomSheet>
	</section>

	<section class="showcase snap-points">
		<h2>Bottom Sheet with Snap Points</h2>
		<p>
			This version of the Bottom Sheet allows users to drag it to predefined snap points. It's great
			for when you want the sheet to stop at specific heights, making the interaction more
			predictable and controlled.
		</p>
		<button onclick={() => (isSnapPointsSheetOpen = true)}>Open Snap Points Sheet</button>
		<BottomSheet
			bind:this={snapPointsSheet}
			settings={{ maxHeight: '90%', snapPoints: [25, 50, 75], startingSnapPoint: 50 }}
			bind:isSheetOpen={isSnapPointsSheetOpen}
			onsnap={(point) => console.log(`Sheet snapped to ${point}%`)}
		>
			<BottomSheet.Sheet style="max-width: 600px; ">
				<BottomSheet.Handle />
				<BottomSheet.Content>
					<h3>Bottom Sheet with Snap Points</h3>
					<p>
						With this sheet, you can drag it up to specific points: 25%, 50%, or 75% of the screen
						height. These snap points provide a more structured interaction, making it easier for
						users to engage with the content.
					</p>
					<div class="snap-indicator">
						<div class="snap-line" style="top: 75%"><span>25%</span></div>
						<div class="snap-line" style="top: 50%"><span>50%</span></div>
						<div class="snap-line" style="top: 25%"><span>75%</span></div>
					</div>
					<p>
						Drag the sheet and notice how it "snaps" to these points. It's a nice UX feature that
						makes it clear to the user where they are in the interaction.
					</p>
				</BottomSheet.Content>
			</BottomSheet.Sheet>
		</BottomSheet>
	</section>

	<section class="showcase long-list">
		<h2>Scrollable Sheet</h2>
		<p>
			Here's a section that contains a large number of items, showing how the bottom sheet can
			handle scrollable content. When the list grows too large, users can scroll to see more.
		</p>
		<button onclick={() => (isLongListSheetOpen = true)}>Open Scrollable Sheet</button>
		<BottomSheet bind:isSheetOpen={isLongListSheetOpen}>
			<BottomSheet.Sheet style="max-width: 600px;">
				<BottomSheet.Handle />
				<BottomSheet.Content>
					<h3>Scrollable List of Items</h3>
					<p>
						As the number of items increases, the sheet becomes scrollable, allowing users to easily
						browse through the content without overcrowding the screen. This feature is ideal for
						displaying long lists or content that doesn’t need to take up the entire screen.
					</p>
					<ul class="item-list">
						{#each Array(50) as _, index}
							<li>Item {index + 1}</li>
						{/each}
					</ul>
				</BottomSheet.Content>
			</BottomSheet.Sheet>
		</BottomSheet>
	</section>

	<section class="showcase events">
		<h2>Track Bottom Sheet Events & Trigger Area</h2>
		<p>
			Keep track of every action performed on the Bottom Sheet. From when it opens to when it
			closes, or even when it's dragged, you can listen to all of the events and keep an accurate
			log of user interactions.<br /><br />The Bottom Sheet Component also provides a trigger area.
		</p>
		<BottomSheet
			bind:isSheetOpen={isEventsSheetOpen}
			onopen={() => logEvent('Bottom Sheet opened.')}
			onclose={() => logEvent('Bottom Sheet closed.')}
			onsheetdragstart={() => logEvent('Bottom Sheet Drag started.')}
			onsheetdragend={() => logEvent('Bottom Sheet Drag ended.')}
		>
			<BottomSheet.Trigger
				style="width: 100px; height: 100px; border: 2px, black, dashed; display: flex; align-items: center; justify-content: center;"
				>Trigger</BottomSheet.Trigger
			>
			<BottomSheet.Sheet style="max-width: 600px; ">
				<BottomSheet.Handle />
				<BottomSheet.Content>
					<h3>Bottom Sheet Event Tracking</h3>
					<p>
						This sheet provides a log of every interaction, including when the sheet is opened and
						closed. You can use this feature to track how users are engaging with the sheet.
					</p>
					<div class="event-log">
						<h4>Event Log:</h4>
						{#each eventLog as event}
							<p transition:fly={{ y: 20, duration: 300 }}>{event}</p>
						{/each}
					</div>
					<p>
						Feel free to open and close the sheet, or perform any other action to see how the log
						updates with every event.
					</p>
				</BottomSheet.Content>
			</BottomSheet.Sheet>
		</BottomSheet>
	</section>
</main>

<style>
	.social-container a {
		color: black;
	}
	.social-container {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		gap: 20px;
	}
	:global(body) {
		font-family: 'Poppins', sans-serif;
		line-height: 1.6;
		color: #333;
		background: linear-gradient(135deg, #fff, #f4f4f4);
		min-height: 100vh;
		margin: 0;
		padding: 20px;
		box-sizing: border-box;
		overflow-x: hidden;
	}

	.wave {
		position: fixed;
		height: 30vh;
		width: 100%;
		background: radial-gradient(circle at top left, rgba(255, 105, 180, 0.2) 0%, transparent 60%);
		filter: blur(80px);
		z-index: -1;
	}

	.wave.one {
		top: -10%;
		left: -10%;
	}

	.wave.two {
		bottom: -10%;
		right: -10%;
		transform: rotate(180deg);
	}

	.shape {
		position: absolute;
		background: rgba(255, 105, 180, 0.3);
		z-index: -1;
	}

	.dots {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		box-shadow:
			50px 30px rgba(255, 105, 180, 0.3),
			100px 60px rgba(255, 105, 180, 0.2),
			150px 90px rgba(255, 105, 180, 0.1);
		top: 10%;
		left: 20%;
	}

	.dots:nth-child(2) {
		top: 30%;
		left: 80%;
	}

	.lines {
		width: 100px;
		height: 2px;
		background: rgba(255, 105, 180, 0.4);
		transform: rotate(-15deg);
		top: 80%;
		left: 5%;
	}

	main {
		max-width: 800px;
		margin: 0 auto;
		position: relative;
		z-index: 2;
	}

	h1 {
		text-align: center;
		color: #ff1c8e;
		font-size: 3em;
		margin-bottom: 0.5em;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	}

	.intro {
		text-align: center;
		color: #333;
		font-size: 1.2em;
		margin-bottom: 2em;
	}

	h2 {
		color: #ff1c8e;
		font-size: 2em;
		margin-bottom: 0.5em;
	}

	.showcase {
		background: rgba(255, 255, 255, 0.9);
		border-radius: 15px;
		padding: 30px;
		margin-bottom: 30px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		position: relative;
	}

	.basic {
		border-top: 5px solid #ff1c8e;
	}
	.snap-points {
		border-top: 5px solid #ff6f00;
	}
	.long-list {
		border-top: 5px solid #ff1c8e;
	}
	.events {
		border-top: 5px solid #ff6f00;
	}

	.item-list {
		margin: 0;
		padding: 0;
		list-style: none;
		margin-top: 20px;
	}

	.item-list li {
		padding: 10px;
		border-bottom: 1px solid #ddd;
	}

	button {
		background-color: #ff6f00;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 25px;
		cursor: pointer;
		font-size: 1em;
		transition: all 0.3s ease;
		margin-top: 15px;
		font-weight: bold;
	}

	.snap-points button {
		background-color: #ff6f00;
	}
	.snap-points button {
		background-color: #ff1c8e;
		color: white;
	}

	button:hover {
		transform: translateY(-2px);
		box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
	}

	.snap-indicator {
		position: relative;
		height: 300px;
		width: 80%;
		justify-self: center;
		border: 2px solid #ff6f00;
		border-radius: 10px;
		margin-top: 20px;
	}

	.snap-line {
		position: absolute;
		width: 100%;
		border-top: 2px dashed #ff6f00;
	}

	.snap-line span {
		position: absolute;
		right: 100%;
		top: -10px;
		background: white;
		padding: 2px 5px;
		border-radius: 5px;
		font-weight: bold;
		color: #ff6f00;
	}

	.event-log {
		background: #fff;
		border: 2px solid #ff1c8e;
		border-radius: 10px;
		padding: 15px;
		margin-top: 20px;
		height: 200px;
		overflow-y: auto;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}

	.event-log h4 {
		margin-top: 0;
		color: #ff1c8e;
	}

	.event-log p {
		margin: 5px 0;
		font-size: 0.9em;
		padding: 5px;
		background: #f7f7f7;
		border-radius: 5px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>

<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import BottomSheet from '$lib/BottomSheet/index.js';
	import { onMount, tick } from 'svelte';

	let darkMode = $state(false);
	let isBasicSheetOpen = $state(false);
	let isSnapPointsSheetOpen = $state(false);
	let isEventsSheetOpen = $state(false);
	let isLongListSheetOpen = $state(false);
	let isCustomLeftOpen = $state(false);
	let isCustomRightOpen = $state(false);
	let isCustomTopOpen = $state(false);
	let eventLog = $state<string[]>([]);
	let mobileMenuOpen = $state(false);
	let githubStars = $state(219);
	let currentPosition = $state<'left' | 'right' | 'bottom' | 'top'>('bottom');

	const logEvent = async (event: string) => {
		await tick();
		eventLog = [...eventLog, `${new Date().toLocaleTimeString()}: ${event}`];

		if (eventLog.length > 5) eventLog.shift();
	};

	async function getStars() {
		const response = await fetch('https://api.github.com/repos/auxidev/svelte-bottom-sheet');
		const data = await response.json();
		return data;
	}

	onMount(async () => {
		githubStars = (await getStars()).stargazers_count;
	});

	const items = Array(50)
		.fill(0)
		.map((_, i) => ({
			id: i + 1,
			title: `Item ${i + 1}`,
			description: `This is a description for item ${i + 1}`
		}));
</script>

<svelte:head>
	<title>Modern Bottom Sheet Preview | SvelteKit</title>
	<meta name="description" content="Interactive preview of bottom sheet components for SvelteKit" />
</svelte:head>

<div class="background" class:dark={darkMode}>
	<div class="gradient-blob one"></div>
	<div class="gradient-blob two"></div>
	<div class="gradient-blob three"></div>

	<div class="grid-pattern"></div>
</div>

<!--Header Section-->
<header class:dark={darkMode} data-nav-open={mobileMenuOpen}>
	<div class="container header-content">
		<div class="logo">
			<span class="logo-text">Svelte Bottom Sheet</span>
		</div>

		<nav class="desktop-nav">
			<a href="#basic" class="nav-link">Basic</a>
			<a href="#snap-points" class="nav-link">Snap Points</a>
			<a href="#scrollable" class="nav-link">Scrollable</a>
			<a href="#events" class="nav-link">Events</a>
			<a href="#position" class="nav-link">Position</a>
		</nav>

		<div class="header-actions">
			<a
				href="https://github.com/AuxiDev/svelte-bottom-sheet"
				class="github-link"
				aria-label="GitHub Repository"
				target="_blank"
				rel="noopener noreferrer"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path
						d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
					/><path d="M9 18c-4.51 2-5-2-7-2" /></svg
				>
			</a>

			<button
				class="mobile-menu-toggle"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Toggle mobile menu"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line
						x1="4"
						x2="20"
						y1="18"
						y2="18"
					/></svg
				>
			</button>
		</div>
	</div>

	<div class="mobile-nav" transition:fly={{ y: -20, duration: 200 }}>
		<a href="#basic" class="nav-link" onclick={() => (mobileMenuOpen = false)}>Basic</a>
		<a href="#snap-points" class="nav-link" onclick={() => (mobileMenuOpen = false)}>Snap Points</a>
		<a href="#scrollable" class="nav-link" onclick={() => (mobileMenuOpen = false)}>Scrollable</a>
		<a href="#events" class="nav-link" onclick={() => (mobileMenuOpen = false)}>Events</a>
		<a href="#position" class="nav-link" onclick={() => (mobileMenuOpen = false)}>Position</a>
	</div>
</header>

<!--Main Section-->
<main>
	<section class="hero">
		<div class="container">
			<h1 transition:fly={{ y: 20, duration: 800, delay: 200, easing: quintOut }}>
				Bottom Sheet
				<span class="highlight">Preview</span>
			</h1>
			<p class="subtitle" transition:fly={{ y: 20, duration: 800, delay: 400, easing: quintOut }}>
				Explore interactive bottom sheets with smooth transitions, snap points, and event tracking.
				Built for SvelteKit.
			</p>

			<a
				href="https://github.com/AuxiDev/svelte-bottom-sheet"
				class="star-button"
				target="_blank"
				rel="noopener noreferrer"
			>
				<div class="star-icon-wrapper">
					<svg
						fill="#FFD700"
						width={20}
						height={20}
						class="star-icon"
						viewBox="0 0 16 16"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							d="M8 12.586l-4.95 2.605 1.2-5.41L.3 5.803l5.49-.475L8 .586l2.21 4.742 5.49.475-3.95 3.978 1.2 5.41z"
						/>
					</svg>
				</div>
				<div class="star-count">
					<span class="star-label">Star</span>
					<span class="star-number">{githubStars}</span>
				</div>
				<div class="star-cta">Star this repo!</div>
			</a>

			<div
				class="cta-buttons"
				transition:fly={{ y: 20, duration: 800, delay: 600, easing: quintOut }}
			>
				<button class="primary-button">
					<a href="#basic" class="href" style="text-decoration: none; color: white;">Try out</a>
				</button>
				<a
					href="https://github.com/AuxiDev/svelte-bottom-sheet"
					class="secondary-button"
					target="_blank"
					rel="noopener noreferrer"
				>
					Star on GitHub
				</a>
			</div>
		</div>
	</section>

	<section id="basic" class="showcase-section">
		<div class="container">
			<div class="section-header">
				<h2>Basic Bottom Sheet</h2>
				<div class="section-line"></div>
			</div>

			<div class="showcase-content">
				<div class="showcase-text">
					<p>
						The Basic Bottom Sheet provides a clean and simple interaction. It slides up smoothly
						from the bottom of the screen, allowing users to quickly access additional content or
						actions.
					</p>
					<ul class="feature-list">
						<li>Smooth animations with customizable easing</li>
						<li>Backdrop overlay with click-to-dismiss</li>
						<li>Drag handle for intuitive interaction</li>
					</ul>
					<button class="demo-button" onclick={() => (isBasicSheetOpen = true)}>
						Open Basic Sheet
					</button>
				</div>

				<div class="showcase-preview">
					<div class="phone-mockup">
						<div class="phone-screen">
							<div class="mock-content">
								<div class="mock-header"></div>
								<div class="mock-text-line"></div>
								<div class="mock-text-line short"></div>
								<div class="mock-sheet-preview">
									<div class="mock-sheet-handle"></div>
									<div class="mock-sheet-content">
										<div class="mock-sheet-title"></div>
										<div class="mock-sheet-text"></div>
										<div class="mock-sheet-text short"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="snap-points" class="showcase-section alt">
		<div class="container">
			<div class="section-header">
				<h2>Snap Points</h2>
				<div class="section-line"></div>
			</div>

			<div class="showcase-content reverse">
				<div class="showcase-preview">
					<div class="phone-mockup">
						<div class="phone-screen">
							<div class="mock-content">
								<div class="mock-header"></div>
								<div class="mock-text-line"></div>
								<div class="mock-text-line short"></div>
								<div class="mock-sheet-preview snap">
									<div class="mock-sheet-handle"></div>
									<div class="mock-snap-indicator">
										<div class="mock-snap-line" style="top: 25%"></div>
										<div class="mock-snap-line" style="top: 50%"></div>
										<div class="mock-snap-line" style="top: 75%"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="showcase-text">
					<p>
						This version of the Bottom Sheet allows users to drag it to predefined snap points. It's
						great for when you want the sheet to stop at specific heights, making the interaction
						more predictable and controlled.
					</p>
					<ul class="feature-list">
						<li>Define multiple snap points (25%, 50%, 75%)</li>
						<li>Set a default starting position</li>
						<li>Sheet automatically snaps to the closest point</li>
					</ul>
					<button class="demo-button" onclick={() => (isSnapPointsSheetOpen = true)}>
						Open Snap Points Sheet
					</button>
				</div>
			</div>
		</div>
	</section>

	<section id="scrollable" class="showcase-section">
		<div class="container">
			<div class="section-header">
				<h2>Scrollable Content</h2>
				<div class="section-line"></div>
			</div>

			<div class="showcase-content">
				<div class="showcase-text">
					<p>
						When your content exceeds the height of the sheet, it automatically becomes scrollable.
						This is perfect for displaying lists, search results, or any content that might be
						lengthy.
					</p>
					<ul class="feature-list">
						<li>Smooth scrolling within the sheet</li>
						<li>Sheet height remains fixed while content scrolls</li>
						<li>Works with dynamic content loading</li>
					</ul>
					<button class="demo-button" onclick={() => (isLongListSheetOpen = true)}>
						Open Scrollable Sheet
					</button>
				</div>

				<div class="showcase-preview">
					<div class="phone-mockup">
						<div class="phone-screen">
							<div class="mock-content">
								<div class="mock-header"></div>
								<div class="mock-text-line"></div>
								<div class="mock-text-line short"></div>
								<div class="mock-sheet-preview">
									<div class="mock-sheet-handle"></div>
									<div class="mock-sheet-content">
										<div class="mock-sheet-title"></div>
										<div class="mock-list">
											<div class="mock-list-item"></div>
											<div class="mock-list-item"></div>
											<div class="mock-list-item"></div>
											<div class="mock-list-item"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section id="events" class="showcase-section alt">
		<div class="container">
			<div class="section-header">
				<h2>Event Tracking</h2>
				<div class="section-line"></div>
			</div>

			<div class="showcase-content reverse">
				<div class="showcase-preview">
					<div class="phone-mockup">
						<div class="phone-screen">
							<div class="mock-content">
								<div class="mock-header"></div>
								<div class="mock-text-line"></div>
								<div class="mock-text-line short"></div>
								<div class="mock-sheet-preview">
									<div class="mock-sheet-handle"></div>
									<div class="mock-sheet-content">
										<div class="mock-sheet-title"></div>
										<div class="mock-event-log">
											<div class="mock-event"></div>
											<div class="mock-event"></div>
											<div class="mock-event"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="showcase-text">
					<p>
						Track every interaction with the Bottom Sheet. From opening and closing to dragging, you
						can listen to all events and keep an accurate log of user interactions.
					</p>
					<ul class="feature-list">
						<li>Event callbacks for open, close, drag start/end</li>
						<li>Snap point change notifications</li>
					</ul>
					<button class="demo-button" onclick={() => (isEventsSheetOpen = true)}>
						Open Events Sheet
					</button>
				</div>
			</div>
		</div>
	</section>

	<section id="position" class="showcase-section">
		<div class="container">
			<div class="section-header">
				<h2>Flexible Positioning</h2>
				<div class="section-line"></div>
			</div>

			<div class="showcase-content">
				<div class="showcase-text">
					<p>
						Position your sheet not just at the bottom, but also at the top, left, or right of the
						screen. This flexibility allows for more creative UI patterns and interactions.
					</p>
					<ul class="feature-list">
						<li>Four positioning options (top, right, bottom, left)</li>
						<li>Consistent interaction patterns regardless of position</li>
						<li>Responsive behavior on all screen sizes</li>
					</ul>
				</div>

				<div class="showcase-preview">
					<div class="position-options">
						<button
							onclick={() => {
								currentPosition = 'top';
								isCustomTopOpen = true;
							}}
							class="position-option top"
							class:active={currentPosition == 'top'}>Top</button
						>
						<button
							onclick={() => {
								currentPosition = 'right';
								isCustomRightOpen = true;
							}}
							class="position-option right"
							class:active={currentPosition == 'right'}>Right</button
						>
						<button
							onclick={() => {
								currentPosition = 'bottom';
								isBasicSheetOpen = true;
							}}
							class="position-option bottom"
							class:active={currentPosition == 'bottom'}>Bottom</button
						>
						<button
							onclick={() => {
								currentPosition = 'left';
								isCustomLeftOpen = true;
							}}
							class="position-option left"
							class:active={currentPosition == 'left'}>Left</button
						>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>

<!-- Bottom Sheets -->
<BottomSheet
	bind:isSheetOpen={isBasicSheetOpen}
	settings={{
		autoCloseThreshold: 0.1,
		closeThreshold: 0.8,
		maxHeight: 0.7
	}}
>
	<BottomSheet.Overlay>
		<BottomSheet.Sheet style="max-width: 600px;">
			<BottomSheet.Handle />
			<BottomSheet.Content>
				<h3>Basic Bottom Sheet</h3>
				<p>
					This sheet allows for basic interactions. It slides up smoothly, and you can either drag
					it down to close or tap outside to dismiss. No complicated features, just the essentials.
				</p>
				<ul>
					<li>No snap points, so it's free to slide anywhere!</li>
					<li>Smooth transitions that feel natural and seamless</li>
					<li>Perfect for displaying quick information or performing simple actions</li>
				</ul>
				<button class="sheet-button" onclick={() => (isBasicSheetOpen = false)}>Close Sheet</button>
			</BottomSheet.Content>
		</BottomSheet.Sheet>
	</BottomSheet.Overlay>
</BottomSheet>

<BottomSheet
	bind:isSheetOpen={isSnapPointsSheetOpen}
	settings={{
		maxHeight: 0.9,
		snapPoints: [0.25, 0.5, 0.75],
		startingSnapPoint: 0.5,
		position: 'bottom'
	}}
	onsnap={(point) => logEvent(`Sheet snapped to ${point * 100}%`)}
>
	<BottomSheet.Sheet style="max-width: 600px;">
		<BottomSheet.Handle />
		<BottomSheet.Content>
			<h3>Bottom Sheet with Snap Points</h3>
			<p>
				With this sheet, you can drag it up to specific points: 25%, 50%, or 75% of the screen
				height. These snap points provide a more structured interaction, making it easier for users
				to engage with the content.
			</p>
			<div class="snap-indicator-container">
				<div class="snap-indicator">
					<div class="snap-line" style="top: 75%"><span>25%</span></div>
					<div class="snap-line" style="top: 50%"><span>50%</span></div>
					<div class="snap-line" style="top: 25%"><span>75%</span></div>
				</div>
			</div>
			<p>
				Drag the sheet and notice how it "snaps" to these points. It's a nice UX feature that makes
				it clear to the user where they are in the interaction.
			</p>
			<button class="sheet-button" onclick={() => (isSnapPointsSheetOpen = false)}
				>Close Sheet</button
			>
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet>

<BottomSheet bind:isSheetOpen={isLongListSheetOpen}>
	<BottomSheet.Sheet style="max-width: 600px;">
		<BottomSheet.Handle />
		<BottomSheet.Content>
			<h3>Scrollable List of Items</h3>
			<p>
				As the number of items increases, the sheet becomes scrollable, allowing users to easily
				browse through the content without overcrowding the screen. This feature is ideal for
				displaying long lists or content that doesn't need to take up the entire screen.
			</p>
			<ul class="item-list">
				{#each items as item}
					<li class="item">
						<div class="item-header">
							<h4>{item.title}</h4>
						</div>
						<p>{item.description}</p>
					</li>
				{/each}
			</ul>
			<button class="sheet-button" onclick={() => (isLongListSheetOpen = false)}>Close Sheet</button
			>
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet>

<BottomSheet bind:isSheetOpen={isCustomRightOpen} settings={{ position: 'right' }}>
	<BottomSheet.Sheet style="max-width: 100%;">
		<BottomSheet.Handle />
		<BottomSheet.Content>
			<h3>Custom Position Sheet</h3>
			<p>
				This sheet is positioned on the right side of the screen instead of the bottom. You can also
				position sheets at the top or left side.
			</p>
			<div class="position-selector">
				<h4>Try different positions:</h4>
			</div>
			<button class="sheet-button" onclick={() => (isCustomRightOpen = false)}>Close Sheet</button>
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet>^

<BottomSheet bind:isSheetOpen={isCustomLeftOpen} settings={{ position: 'left' }}>
	<BottomSheet.Sheet style="max-width: 100%;">
		<BottomSheet.Handle />
		<BottomSheet.Content>
			<h3>Custom Position Sheet</h3>
			<p>
				This sheet is positioned on the left side of the screen instead of the bottom. You can also
				position sheets at the top or right side.
			</p>
			<div class="position-selector">
				<h4>Try different positions:</h4>
			</div>
			<button class="sheet-button" onclick={() => (isCustomLeftOpen = false)}>Close Sheet</button>
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet>

<BottomSheet bind:isSheetOpen={isCustomTopOpen} settings={{ position: 'top' }}>
	<BottomSheet.Sheet style="max-height: 100%;">
		<BottomSheet.Handle />
		<BottomSheet.Content>
			<h3>Custom Position Sheet</h3>
			<p>
				This sheet is positioned on the top of the screen instead of the bottom. You can also
				position sheets at the left or right side.
			</p>
			<div class="position-selector">
				<h4>Try different positions:</h4>
			</div>
			<button class="sheet-button" onclick={() => (isCustomTopOpen = false)}>Close Sheet</button>
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet>

<BottomSheet
	bind:isSheetOpen={isEventsSheetOpen}
	onopen={() => logEvent('Bottom Sheet opened')}
	onclose={() => logEvent('Bottom Sheet closed')}
	onsheetdragstart={() => logEvent('Bottom Sheet drag started')}
	onsheetdragend={() => logEvent('Bottom Sheet drag ended')}
>
	<BottomSheet.Sheet style="max-width: 600px;">
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
				{#if eventLog.length === 0}
					<p class="empty-log">No events yet. Try interacting with the sheet.</p>
				{/if}
			</div>
			<p>
				Feel free to open and close the sheet, or perform any other action to see how the log
				updates with every event.
			</p>
			<button class="sheet-button" onclick={() => (isEventsSheetOpen = false)}>Close Sheet</button>
		</BottomSheet.Content>
	</BottomSheet.Sheet>
</BottomSheet>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Segoe UI', sans-serif;
		line-height: 1.6;
		color: #1a202c;
		background-color: #ffffff;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.container {
		width: 100%;
	}

	main {
		margin: 1rem;
	}

	/* Background */
	.background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		overflow: hidden;
	}
	.gradient-blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.5;
		transition: all 0.5s ease;
	}
	.gradient-blob.one {
		top: -10%;
		left: -10%;
		width: 50%;
		height: 50%;
		background: radial-gradient(circle at center, rgba(255, 105, 180, 0.3) 0%, transparent 70%);
	}
	.gradient-blob.two {
		bottom: -20%;
		right: -10%;
		width: 60%;
		height: 60%;
		background: radial-gradient(circle at center, rgba(255, 111, 0, 0.2) 0%, transparent 70%);
	}
	.gradient-blob.three {
		top: 40%;
		left: 30%;
		width: 40%;
		height: 40%;
		background: radial-gradient(circle at center, rgba(130, 80, 223, 0.15) 0%, transparent 70%);
	}

	.grid-pattern {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
		background-size: 20px 20px;
		opacity: 0.5;
		transition: opacity 0.3s ease;
	}

	/* Header */
	header {
		position: fixed;
		top: 0;
		left: 0;
		max-width: 100%;
		z-index: 100;
		overflow: hidden;
		width: 100dvw;
		transition:
			background-color 0.3s ease,
			border-color 0.3s ease;
		background-color: rgba(255, 255, 255, 0.8);
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
		backdrop-filter: blur(10px);
	}

	.header-content {
		display: flex;
		width: 100%;
		max-width: 100vw;
		justify-content: space-around;
		gap: 1rem;
		align-items: center;
		height: 70px;
		overflow-x: hidden;
	}

	.logo {
		display: flex;
		align-items: center;
	}
	.logo-text {
		font-weight: 700;
		font-size: 1.5rem;
		background: linear-gradient(90deg, #ff1c8e, #ff6f00);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.desktop-nav {
		display: none;
	}

	.nav-link {
		color: #4a5568;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s ease;
		position: relative;
	}
	.nav-link:hover {
		color: #ff1c8e;
	}
	.nav-link::after {
		content: '';
		position: absolute;
		bottom: -5px;
		left: 0;
		width: 0;
		height: 2px;
		background: linear-gradient(90deg, #ff1c8e, #ff6f00);
		transition: width 0.3s ease;
	}
	.nav-link:hover::after {
		width: 100%;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.github-link,
	.mobile-menu-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.05);
		color: #4a5568;
		border: none;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			color 0.2s ease,
			transform 0.2s ease;
	}
	.github-link:hover,
	.mobile-menu-toggle:hover {
		background-color: rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	@media (min-width: 768px) {
		.desktop-nav {
			display: flex;
			gap: 2rem;
		}
		.mobile-menu-toggle {
			display: none;
		}
	}

	.mobile-nav {
		display: flex;
		flex-direction: column;
		padding: 0rem 1rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
		max-height: 0;
		opacity: 0;
		visibility: hidden;
		height: 100%;
		transition:
			max-height 0.2s ease,
			opacity 0.2s ease,
			visibility 0.2s ease,
			padding 0.2s ease;
	}

	[data-nav-open='true'] .mobile-nav {
		max-height: max-content;
		opacity: 1;
		visibility: visible;
		padding: 1rem;
	}

	.mobile-nav .nav-link {
		padding: 0.75rem 0;
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
	}

	/* Hero */
	.hero {
		padding: 6rem 0 4rem;
		text-align: center;
	}
	h1 {
		font-size: 3rem;
		font-weight: 800;
		line-height: 1.2;
		margin-bottom: 1.5rem;
		color: #1a202c;
	}

	.highlight {
		background: linear-gradient(90deg, #ff1c8e, #ff6f00);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}
	.subtitle {
		font-size: 1.25rem;
		color: #4a5568;
		max-width: 700px;
		margin: 0 auto 2.5rem;
	}

	.cta-buttons {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.primary-button,
	.secondary-button {
		padding: 0.75rem 1.5rem;
		border-radius: 50px;
		font-weight: 600;
		font-size: 1rem;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		cursor: pointer;
		text-decoration: none;
	}
	.primary-button {
		background: linear-gradient(90deg, #ff1c8e, #ff6f00);
		color: white;
		border: none;
		box-shadow: 0 4px 14px rgba(255, 28, 142, 0.3);
	}
	.secondary-button {
		background-color: rgba(0, 0, 0, 0.05);
		color: #4a5568;
		border: none;
	}

	.primary-button:hover,
	.secondary-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(255, 28, 142, 0.4);
	}
	.secondary-button:hover {
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
	}

	.star-button {
		display: flex;
		align-items: center;
		padding: 0.5rem 1.5rem;
		height: 35px;
		max-width: 400px;
		width: 80%;
		justify-self: center;
		background: linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
		border: 1px solid rgba(255, 105, 180, 0.3);
		border-radius: 50px;
		color: #1a202c;
		text-decoration: none;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
		box-shadow: 0 4px 15px rgba(255, 28, 142, 0.2);
		margin: 16px 16px 40px;
	}

	.star-button:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 25px rgba(255, 28, 142, 0.3);
	}

	.star-icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12px;
	}

	.star-icon {
		transition: all 0.5s ease;
		animation: star-pulse 1.5s infinite alternate ease-in-out;
	}

	@keyframes star-pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.3) rotate(20deg);
		}
		100% {
			transform: scale(1) rotate(-5deg);
		}
	}

	.star-count {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.star-label {
		font-size: 0.8rem;
		opacity: 0.7;
	}

	.star-number {
		font-size: 1.2rem;
		font-weight: 700;
		line-height: 1.5rem;
	}

	.star-cta {
		position: absolute;
		right: -180px;
		background: linear-gradient(90deg, #ff1c8e, #ff6f00);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-weight: 600;
		font-size: 0.9rem;
		transition: all 0.5s ease;
		opacity: 0;
		animation: slide-in 15s ease-in-out;
		animation-iteration-count: infinite;
	}

	@keyframes slide-in {
		0% {
			right: -180px;
			opacity: 0;
		}
		4% {
			right: 20px;
			opacity: 1;
		}
		16% {
			right: 20px;
			opacity: 1;
		}
		20% {
			right: -180px;
			opacity: 0;
		}
	}

	/* Showcase */
	.showcase-section {
		padding: 6rem 0;
		position: relative;
	}
	.showcase-section.alt {
		background-color: rgba(0, 0, 0, 0.02);
	}

	.section-header {
		text-align: center;
		margin-bottom: 3rem;
	}
	h2 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
		color: #1a202c;
	}

	.section-line {
		height: 4px;
		width: 60px;
		background: linear-gradient(90deg, #ff1c8e, #ff6f00);
		margin: 0 auto;
		border-radius: 2px;
	}
	.showcase-content {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
		align-items: center;
	}
	@media (min-width: 768px) {
		.showcase-content,
		.showcase-content.reverse {
			grid-template-columns: 1fr 1fr;
		}
	}
	.showcase-text {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.showcase-text p {
		color: #4a5568;
		font-size: 1.1rem;
	}

	.feature-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.feature-list li {
		position: relative;
		padding-left: 1.5rem;
		margin-bottom: 0.75rem;
		color: #4a5568;
	}
	.feature-list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.5rem;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: linear-gradient(90deg, #ff1c8e, #ff6f00);
	}

	.demo-button {
		align-self: flex-start;
		padding: 0.75rem 1.5rem;
		border-radius: 50px;
		font-weight: 600;
		font-size: 1rem;
		background-color: rgba(0, 0, 0, 0.05);
		color: #4a5568;
		border: none;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			transform 0.2s ease;
	}
	.demo-button:hover {
		background-color: rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	/* Phone mockup */
	.phone-mockup {
		width: 280px;
		height: 560px;
		background-color: #1a202c;
		border-radius: 36px;
		padding: 12px;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		margin: 0 auto;
		position: relative;
		overflow: hidden;
	}
	.phone-screen {
		width: 100%;
		height: 100%;
		background-color: white;
		border-radius: 24px;
		overflow: hidden;
		position: relative;
	}
	.mock-content {
		padding: 20px;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.mock-header {
		height: 24px;
		background-color: #f0f0f0;
		border-radius: 12px;
		margin-bottom: 20px;
	}
	.mock-text-line {
		height: 12px;
		background-color: #f0f0f0;
		border-radius: 6px;
		margin-bottom: 10px;
	}
	.mock-text-line.short {
		width: 70%;
	}
	.mock-sheet-preview {
		margin-top: auto;
		height: 200px;
		background-color: #f8f8f8;
		border-radius: 16px 16px 0 0;
		box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
		padding: 16px;
		position: relative;
	}
	.mock-sheet-preview.snap {
		height: 300px;
	}
	.mock-sheet-handle {
		width: 40px;
		height: 4px;
		background-color: #ddd;
		border-radius: 2px;
		margin: 0 auto 16px;
	}
	.mock-sheet-title {
		height: 16px;
		width: 120px;
		background-color: #e0e0e0;
		border-radius: 8px;
		margin-bottom: 16px;
	}
	.mock-sheet-text {
		height: 10px;
		background-color: #e0e0e0;
		border-radius: 5px;
		margin-bottom: 8px;
	}
	.mock-sheet-text.short {
		width: 80%;
	}
	.mock-snap-indicator {
		height: 200px;
		border: 2px dashed #ddd;
		border-radius: 8px;
		margin-top: 16px;

		position: relative;
	}
	.mock-snap-line {
		position: absolute;
		width: 100%;
		height: 2px;
		background-color: #ff1c8e;
		opacity: 0.5;
	}
	.mock-list {
		margin-top: 16px;
	}
	.mock-list-item {
		height: 40px;
		background-color: #e0e0e0;
		border-radius: 8px;
		margin-bottom: 8px;
	}
	.mock-event-log {
		margin-top: 16px;
		padding: 8px;
		background-color: #e8e8e8;
		border-radius: 8px;
	}
	.mock-event {
		height: 10px;
		background-color: #d0d0d0;
		border-radius: 5px;
		margin-bottom: 8px;
	}

	/* Position options */
	.position-options {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(3, 1fr);
		gap: 10px;
		width: 200px;
		height: 200px;
		margin: 0 auto;
	}
	.position-option {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.05);
		border-radius: 8px;
		font-weight: 500;
		color: #4a5568;
		border: none;
		font-weight: bold;
		transition: transform 0.2s ease;
	}

	.active {
		background: linear-gradient(90deg, #ff1c8e, #ff6f00);
		color: white;
	}

	.position-option:hover {
		transform: translateY(-2px);
	}
	.position-option.top {
		grid-column: 2;
		grid-row: 1;
	}
	.position-option.right {
		grid-column: 3;
		grid-row: 2;
	}
	.position-option.bottom {
		grid-column: 2;
		grid-row: 3;
	}
	.position-option.left {
		grid-column: 1;
		grid-row: 2;
	}

	/* Bottom sheet */
	.snap-indicator-container {
		display: flex;
		width: 100%;
		justify-content: center;
	}
	.snap-indicator {
		position: relative;
		height: 300px;
		width: 80%;
		border: 2px solid #ff6f00;
		border-radius: 10px;
		margin: 20px 0;
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
		margin-right: 10px;
	}

	.event-log {
		background: #f8f8f8;
		border: 2px solid #ff1c8e;
		border-radius: 10px;
		padding: 15px;
		margin: 20px 0;
		height: 200px;
		overflow-y: auto;
	}

	.event-log h4 {
		margin-top: 0;
		color: #ff1c8e;
	}
	.event-log p {
		margin: 5px 0;
		font-size: 0.9em;
		padding: 8px;
		background: #f0f0f0;
		border-radius: 5px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}
	.empty-log {
		color: #a0aec0;
		font-style: italic;
	}
	.item-list {
		list-style: none;
		padding: 0;
		margin: 20px 0;
		max-width: 100%;
	}
	.item {
		padding: 12px;
		border-radius: 8px;
		background-color: #f8f8f8;
		margin-bottom: 10px;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.item:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.item-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 4px;
	}
	.item-header h4 {
		margin: 0;
		color: #1a202c;
	}

	.sheet-button {
		padding: 0.75rem 1.5rem;
		border-radius: 50px;
		font-weight: 600;
		font-size: 1rem;
		background: linear-gradient(90deg, #ff1c8e, #ff6f00);
		color: white;
		border: none;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		margin-top: 20px;
		align-self: flex-start;
	}
	.sheet-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(255, 28, 142, 0.4);
	}

	.position-selector {
		margin: 20px 0;
	}
</style>

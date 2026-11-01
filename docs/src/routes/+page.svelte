<script lang="ts">
	import SiteBrand from '#lib/components/SiteBrand.svelte';
	import ExternalLinks from '#lib/components/ExternalLinks.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import * as BottomSheet from 'svelte-bottom-sheet';
	import { Menu } from '@lucide/svelte';

	let copied = $state(false);
	let copyTimeout: ReturnType<typeof setTimeout>;

	const copyCommand = async () => {
		await navigator.clipboard.writeText('npm install svelte-bottom-sheet');

		copied = true;
		clearTimeout(copyTimeout);

		copyTimeout = setTimeout(() => {
			copied = false;
		}, 2000);
	};

	$effect(() => {
		return () => clearTimeout(copyTimeout);
	});
</script>

<Seo />

<div class="mx-auto flex min-h-screen max-w-5xl flex-col px-6">
	<header class="flex h-16 items-center justify-between border-b border-neutral-200">
		<SiteBrand />

		<div class="hidden md:flex md:items-center md:gap-5">
			<a
				href="/docs/getting-started"
				class="text-sm text-neutral-600 transition-colors hover:text-neutral-950"
			>
				Docs
			</a>

			<ExternalLinks variant="header" />
		</div>

		<BottomSheet.Root position="left" sheetSideOffset={8} fitContent>
			<BottomSheet.Trigger
				class="flex size-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 md:hidden "
				aria-label="Open navigation menu"
			>
				<Menu size={22} />
			</BottomSheet.Trigger>

			<BottomSheet.Sheet class="top-2! bottom-2! rounded-2xl shadow-2xl">
				<BottomSheet.Content class="flex h-full flex-col gap-6 rounded-2xl bg-white p-6 ">
					<h2 class="text-base font-semibold text-slate-900">Navigation</h2>
					<a
						href="/docs/getting-started"
						class="text-sm text-neutral-600 transition-colors hover:text-neutral-950"
					>
						Docs
					</a>

					<ExternalLinks />
				</BottomSheet.Content>
			</BottomSheet.Sheet>
		</BottomSheet.Root>
	</header>

	<main class="flex flex-1 flex-col items-center justify-center py-24 text-center">
		<p class="mb-4 text-sm font-medium text-pink-600">Announcing 3.0.0</p>

		<h1 class="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
			Bottom sheets, without the hassle.
		</h1>

		<p class="mt-5 max-w-lg text-base leading-7 text-neutral-600">
			A lightweight, customizable bottom sheet component with flexible positioning, smooth gestures,
			snap points and tons of options to customize the behaviour for your needs.
		</p>

		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a
				href="/docs/getting-started"
				class="d rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700"
			>
				Read the docs
			</a>

			<a
				href="https://github.com/AuxiDev/svelte-bottom-sheet"
				target="_blank"
				rel="noopener noreferrer"
				class="flex items-center gap-2 rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-medium transition hover:bg-neutral-100"
			>
				<svg class="size-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
					<path
						d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
					/>
				</svg>
				<span>Star on GitHub</span>
			</a>
		</div>

		<div
			class="mt-10 flex max-w-full items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 font-mono text-sm"
		>
			<span class="text-neutral-500">$</span>
			<code class="break-all">npm install svelte-bottom-sheet</code>

			<button
				class="shrink-0 text-xs font-medium text-neutral-500 transition hover:text-neutral-900"
				onclick={copyCommand}
				aria-label="Copy install command"
			>
				{copied ? 'Copied!' : 'Copy'}
			</button>
		</div>
	</main>

	<footer
		class="flex min-h-14 items-center justify-between gap-4 border-t border-neutral-200 text-xs text-neutral-500"
	>
		<span>By AuxiDev</span>

		<a
			href="https://github.com/AuxiDev/svelte-bottom-sheet"
			target="_blank"
			rel="noopener noreferrer"
			class="transition-colors hover:text-neutral-900"
		>
			Source code
		</a>
	</footer>
</div>

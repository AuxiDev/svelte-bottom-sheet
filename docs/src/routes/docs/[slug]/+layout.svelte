<script lang="ts">
	import { Menu } from '@lucide/svelte';
	import { BottomSheet } from 'svelte-bottom-sheet';

	import SiteBrand from '#lib/components/SiteBrand.svelte';
	import ExternalLinks from '#lib/components/ExternalLinks.svelte';
	import DocsNavigation from '#lib/components/DocsNavigation.svelte';
	import DocsToc from '#lib/components/DocsToc.svelte';
	import Seo from '#lib/components/Seo.svelte';

	let { data, children } = $props();
</script>

<Seo />

<header class="mb-6 flex h-16 items-center justify-between border-b border-slate-200 px-4">
	<SiteBrand />

	<BottomSheet position="left" sheetSideOffset={8} fitContent>
		<BottomSheet.Trigger
			class="flex size-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 lg:hidden "
			aria-label="Open documentation menu"
		>
			<Menu size={22} />
		</BottomSheet.Trigger>

		<BottomSheet.Sheet class="top-2! bottom-2! rounded-2xl shadow-2xl">
			<BottomSheet.Content class="flex h-full flex-col gap-6 rounded-2xl bg-white p-6 ">
				<h2 class="text-base font-semibold text-slate-900">Documentation</h2>

				<DocsNavigation />

				<div class="mt-auto">
					<ExternalLinks />
				</div>
			</BottomSheet.Content>
		</BottomSheet.Sheet>
	</BottomSheet>
</header>

<div
	class="mx-auto max-w-6xl px-4 py-8 lg:grid lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-10 lg:py-10 xl:grid-cols-[minmax(0,220px)_minmax(0,1fr)_minmax(0,200px)] xl:gap-12"
>
	<aside class="hidden lg:block">
		<div class="sticky top-8 space-y-6">
			<div>
				<p class="mb-4 px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">
					Documentation
				</p>

				<DocsNavigation />
			</div>

			<ExternalLinks />
		</div>
	</aside>

	<main class="min-w-0">
		<article class="prose max-w-none prose-slate">
			<data.content />
		</article>
	</main>

	<aside class="hidden xl:block">
		<DocsToc headings={data.headings} />
	</aside>
</div>

{@render children()}

<script lang="ts">
	let {
		headings = []
	}: {
		headings?: {
			id: string;
			text: string;
			level: number;
		}[];
	} = $props();

	let activeHeading = $state<string | null>(null);

	$effect(() => {
		if (!headings.length) {
			activeHeading = null;
			return;
		}

		const elements = headings
			.map(({ id }) => document.getElementById(id))
			.filter((element: any): element is HTMLElement => element instanceof HTMLElement);

		if (!elements.length) {
			activeHeading = null;
			return;
		}

		activeHeading = elements[0].id;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

				if (visible.length) {
					activeHeading = visible[0].target.id;
				}
			},
			{
				rootMargin: '-10% 0px -75% 0px',
				threshold: 0
			}
		);

		elements.forEach((element: any) => observer.observe(element));

		return () => observer.disconnect();
	});
</script>

<nav class="sticky top-8 border-l border-slate-200 pl-5" aria-label="On this page">
	<h2 class="text-xs font-semibold tracking-wider text-slate-500 uppercase">On this page</h2>

	{#if !headings.length}
		<p class="mt-4 text-sm text-slate-500 italic">No headings found</p>
	{:else}
		<ul class="mt-4 space-y-1">
			{#each headings as heading (heading.id)}
				<li class:pl-3={heading.level === 3}>
					<a
						href={`#${heading.id}`}
						aria-current={activeHeading === heading.id ? 'location' : undefined}
						class={[
							'block rounded-md py-1 text-sm leading-relaxed wrap-break-word transition-colors',
							activeHeading === heading.id
								? 'font-medium text-slate-900 '
								: 'text-slate-500 hover:text-slate-800 '
						]}
					>
						{heading.text}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</nav>

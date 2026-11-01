<script lang="ts">
	import { page } from '$app/state';

	const docsPages = [
		{ label: 'Getting started', href: '/docs/getting-started' },
		{ label: 'API reference', href: '/docs/api' },
		{ label: 'Styling', href: '/docs/styling' },
		{ label: 'Basic Examples', href: '/docs/example-basics' },
		{ label: 'Advanced Examples', href: '/docs/example-advanced' },
		{ label: 'Migrate from v2 to v3', href: '/docs/migrate-v2-to-v3' }
	];
</script>

<nav>
	<ul class="space-y-1">
		{#each docsPages as doc (doc.href)}
			<li>
				<a
					href={doc.href}
					aria-current={page.url.pathname === doc.href ? 'page' : undefined}
					class={[
						'block rounded-lg px-3 py-2 text-sm transition-colors',
						page.url.pathname === doc.href
							? 'bg-slate-100 font-semibold text-slate-900'
							: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
					]}
				>
					{doc.label}
				</a>
			</li>
		{/each}
	</ul>
</nav>

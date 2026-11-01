<script lang="ts">
	let { variant = 'stacked' }: { variant?: 'header' | 'stacked' } = $props();

	const links = [
		{
			label: 'npm',
			accessibleLabel: 'npm package',
			href: 'https://www.npmjs.com/package/svelte-bottom-sheet',
			icon: 'npm'
		},
		{
			label: 'GitHub',
			accessibleLabel: 'GitHub repository',
			href: 'https://github.com/AuxiDev/svelte-bottom-sheet',
			icon: 'github'
		}
	];
</script>

{#if variant === 'header'}
	<nav aria-label="External links" class="flex items-center gap-5 text-sm text-neutral-600">
		{#each links as link (link.href)}
			<a
				href={link.href}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={link.accessibleLabel}
				class="flex items-center gap-1.5 transition-colors hover:text-neutral-950"
			>
				{#if link.icon === 'npm'}
					<svg class="size-4 shrink-0 fill-current" viewBox="0 0 256 256" aria-hidden="true">
						<path
							d="M0 0v256h256V0H0zm213.333 213.333H170.667V85.333h-42.667v128H42.667V42.667h170.666v170.666z"
						/>
					</svg>
				{:else}
					<svg class="size-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
						<path
							d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
						/>
					</svg>
				{/if}
				<span>{link.label}</span>
			</a>
		{/each}
	</nav>
{:else}
	<nav aria-label="External links" class="space-y-1 border-t border-slate-200 pt-4">
		{#each links as link (link.href)}
			<a
				href={link.href}
				target="_blank"
				rel="noopener noreferrer"
				class="block rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
			>
				{link.icon === 'npm' ? 'npm package' : 'GitHub repository'}
			</a>
		{/each}
	</nav>
{/if}

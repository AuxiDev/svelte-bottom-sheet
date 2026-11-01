<script lang="ts">
	import { Check, Copy, FileCodeCorner, Terminal } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	let {
		title = 'Terminal',
		children,
		textToCopy
	}: {
		title?: string;
		children: Snippet;
		textToCopy: string;
	} = $props();

	let copied = $state(false);

	let isTerminal = $derived(title.toLowerCase() === 'terminal');

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(textToCopy);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch (err) {
			console.error('Error while copying (report):', err);
		}
	};
</script>

<div class=" overflow-hidden rounded-xl border border-slate-200 bg-white">
	<div class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-2">
		<div class="flex items-center gap-2 text-xs font-medium text-slate-500">
			{#if isTerminal}
				<Terminal size={16} />
			{:else}
				<FileCodeCorner size={16} />
			{/if}
			<span>{title}</span>
		</div>

		<button
			onclick={copyToClipboard}
			class="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
			aria-label="Code kopieren"
		>
			{#if copied}
				<Check size={16} />
			{:else}
				<Copy size={16} />
			{/if}
		</button>
	</div>

	<div class="overflow-x-auto bg-white p-4 font-mono text-sm prose-pre:my-0 prose-pre:p-0">
		{@render children()}
	</div>
</div>

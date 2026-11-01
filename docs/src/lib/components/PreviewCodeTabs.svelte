<script lang="ts">
	import { Check, Copy, FileCodeCorner } from '@lucide/svelte';
	import { codeToHtml } from 'shiki';
	import type { Snippet } from 'svelte';

	let {
		source,
		language = 'svelte',
		preview
	}: {
		source: string;
		language?: string;
		preview: Snippet;
	} = $props();

	let activeTab = $state<'preview' | 'code'>('preview');
	let copied = $state(false);
	let highlightedCode = $state('');

	$effect(() => {
		let cancelled = false;

		codeToHtml(source.trim(), {
			lang: language,
			theme: 'github-light'
		}).then((html) => {
			if (!cancelled) highlightedCode = html;
		});

		return () => {
			cancelled = true;
		};
	});

	const copyCode = async () => {
		try {
			await navigator.clipboard.writeText(source.trim());
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch (error) {
			console.error('Error while copying code:', error);
		}
	};
</script>

<div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
	<div class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-3">
		<div class="flex items-center gap-4">
			<button
				onclick={() => (activeTab = 'preview')}
				class={`border-b-2 px-2 py-3 text-xs ${
					activeTab === 'preview'
						? 'border-slate-900 font-semibold '
						: 'border-transparent text-slate-500'
				}`}
			>
				Preview
			</button>

			<button
				onclick={() => (activeTab = 'code')}
				class={`flex items-center gap-1.5 border-b-2 px-2 py-3 text-xs ${
					activeTab === 'code'
						? 'border-slate-900 font-semibold '
						: 'border-transparent text-slate-500'
				}`}
			>
				<FileCodeCorner size={15} />
				Code
			</button>
		</div>

		<button
			onclick={copyCode}
			class="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
			aria-label="Copy code"
		>
			{#if copied}
				<Check size={16} />
			{:else}
				<Copy size={16} />
			{/if}
		</button>
	</div>

	{#if activeTab === 'preview'}
		<div class="flex min-h-40 items-center justify-center p-6">
			{@render preview()}
		</div>
	{:else}
		<div
			class="overflow-x-auto bg-white p-4 font-mono text-sm leading-relaxed prose-pre:my-0 prose-pre:p-0"
		>
			{@html highlightedCode}
		</div>
	{/if}
</div>

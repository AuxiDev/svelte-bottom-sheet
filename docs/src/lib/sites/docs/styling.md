<script>
  import CopyCommandLine from '#lib/components/CopyCommandLine.svelte';
</script>

# Styling & Customization

Svelte Bottom Sheet provides unstyled components so you can adapt them to your application's design system. Style the rendered elements with global CSS, inline styles or utility classes. When you need to control the rendered element itself, use the `child` snippet.

## Inline styles

For dynamic or one-off styles, use the `style` attribute.

```svelte
<BottomSheet.Sheet style="background: white; border-radius: 1rem 1rem 0 0;">
	<BottomSheet.Content>Your content</BottomSheet.Content>
</BottomSheet.Sheet>
```

## Styling with Tailwind CSS

If your project uses Tailwind CSS, you can pass utility classes directly to components that forward HTML attributes to their rendered elements.

```svelte
<BottomSheet.Sheet class="rounded-t-2xl bg-white text-zinc-900 shadow-2xl">
	<BottomSheet.Content class="p-6">
		<h2 class="text-lg font-semibold">Settings</h2>
		<p class="mt-2 text-sm text-zinc-600">Manage your preferences.</p>
	</BottomSheet.Content>
</BottomSheet.Sheet>
```

Tailwind utilities are ordinary class names in the rendered DOM, so they don't depend on Svelte's component-scoped CSS selectors.

## Styling with CSS

Svelte scopes styles to the component where they are defined. To style elements rendered by Svelte Bottom Sheet from another component, use can use global selectors or define the styles in a global stylesheet.

For example, in your global CSS file:

```css
:global(.sheet-panel) {
	border-radius: 1rem 1rem 0 0;
	background: white;
	color: #18181b;
	box-shadow: 0 -8px 32px rgb(0 0 0 / 12%);
}

:global(.sheet-overlay) {
	background: rgb(0 0 0 / 45%);
}

:global(.sheet-handle) {
	width: 2.5rem;
	height: 0.25rem;
	margin: 0.75rem auto;
	border-radius: 999px;
	background: #d4d4d8;
}
```

Apply the classes to the corresponding components:

```svelte
<BottomSheet.Overlay class="sheet-overlay" />

<BottomSheet.Sheet class="sheet-panel">
	<BottomSheet.Handle class="sheet-handle" />
	<BottomSheet.Content>Your content</BottomSheet.Content>
</BottomSheet.Sheet>
```

These selectors work because they are global, not because styles automatically cross component boundaries.
It's not the optimal way of applying styles though.

## Custom elements with `child`

Use the `child` snippet when styling isn't enough and you need to replace the element rendered by a component. This is useful for integrating your own design-system components while forwarding the props required for the original component's behavior.

```svelte
<BottomSheet.Trigger>
	{#snippet child({ props })}
		<button {...props} class="custom-trigger"> Open settings </button>
	{/snippet}
</BottomSheet.Trigger>
```

You can now style `.custom-trigger` in the current component's scoped stylesheet because the button is declared directly in that component's markup.

```svelte
<style>
	.custom-trigger {
		padding: 0.75rem 1rem;
		border: 0;
		border-radius: 0.75rem;
		background: #18181b;
		color: white;
		cursor: pointer;
	}
</style>
```

The `child` snippet receives a `props` object from the component. Spreading `{...props}` onto your custom element forwards the supplied attributes and event handlers.

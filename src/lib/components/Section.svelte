<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		actions,
		children,
		flush = false
	}: {
		title?: string;
		description?: string;
		actions?: Snippet;
		children: Snippet;
		flush?: boolean;
	} = $props();
</script>

<section class="panel overflow-hidden">
	{#if title}
		<div class="hairline flex items-center justify-between gap-4 px-5 py-4">
			<div>
				<h2 class="text-sm font-semibold tracking-tight">{title}</h2>
				{#if description}
					<p class="mt-0.5 text-xs text-muted">{description}</p>
				{/if}
			</div>
			{#if actions}{@render actions()}{/if}
		</div>
	{/if}
	<div class={flush ? '' : 'p-5'}>{@render children()}</div>
</section>

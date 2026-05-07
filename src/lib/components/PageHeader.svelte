<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		eyebrow,
		title,
		subtitle,
		actions
	}: {
		eyebrow?: string;
		title: string;
		subtitle?: Snippet;
		actions?: Snippet;
	} = $props();
</script>

<div class="hairline mb-6 flex flex-wrap items-end justify-between gap-6 pb-6">
	<div class="space-y-1.5">
		{#if eyebrow}
			<p
				class="text-[11px] font-medium tracking-[0.16em] text-muted uppercase"
			>
				{eyebrow}
			</p>
		{/if}
		<h1 class="text-[32px] leading-[1.05] font-semibold tracking-[-0.022em]">
			{title}
		</h1>
		{#if subtitle}
			<div class="text-sm text-muted">{@render subtitle()}</div>
		{/if}
	</div>
	{#if actions}
		<div class="flex items-center gap-2">{@render actions()}</div>
	{/if}
</div>

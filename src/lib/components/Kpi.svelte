<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label,
		value,
		hint,
		emphasis = false,
		mono = false
	}: {
		label: string;
		value: Snippet | string | number;
		hint?: Snippet | string;
		emphasis?: boolean;
		mono?: boolean;
	} = $props();
</script>

<div class="panel relative overflow-hidden p-5">
	{#if emphasis}
		<span
			class="absolute inset-x-0 top-0 h-px"
			style="background: linear-gradient(to right, transparent, var(--color-fision-pink), transparent);"
		></span>
	{/if}
	<p class="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
		{label}
	</p>
	<div
		class="tabular-nums mt-3 text-[28px] leading-[1] font-semibold tracking-[-0.018em] {mono
			? 'font-mono text-[20px]'
			: ''} {emphasis ? 'text-pink-500' : 'text-foreground'}"
	>
		{#if typeof value === 'function'}
			{@render value()}
		{:else}
			{value}
		{/if}
	</div>
	{#if hint}
		<p class="mt-2 text-xs text-muted">
			{#if typeof hint === 'function'}
				{@render hint()}
			{:else}
				{hint}
			{/if}
		</p>
	{/if}
</div>

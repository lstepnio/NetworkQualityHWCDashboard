<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import { tierLabel } from '$lib/format';

	let { data }: { data: { tier: string; n: number }[] } = $props();

	const TIER_COLOR: Record<string, string> = {
		uhd_hdr: '#EE3D5B',
		uhd: '#C4365A',
		hd: '#67E8F9',
		sd: '#8A96AD',
		none: '#F43F5E'
	};

	let display = $derived(data.filter((d) => d.n > 0));
	let max = $derived(display.length === 0 ? 1 : Math.max(...display.map((d) => d.n)));
</script>

<Section title="Tier distribution" description="Achieved tier across the most recent runs">
	{#if display.length === 0}
		<p class="py-12 text-center text-sm text-muted">No certifications yet.</p>
	{:else}
		<div class="space-y-2.5">
			{#each display as d (d.tier)}
				<div class="flex items-center gap-3 text-xs">
					<span class="w-16 shrink-0 font-medium text-muted">{tierLabel(d.tier)}</span>
					<div class="relative h-7 flex-1 rounded-md bg-white/[0.03]">
						<div
							class="absolute inset-y-0 left-0 rounded-md transition-[width]"
							style="width: {(d.n / max) * 100}%; background: {TIER_COLOR[d.tier] ??
								'#EE3D5B'};"
						></div>
					</div>
					<span class="tabular-nums w-10 shrink-0 text-right font-semibold">{d.n}</span>
				</div>
			{/each}
		</div>
	{/if}
</Section>

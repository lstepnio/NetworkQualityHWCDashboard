<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import TierBadge from '$lib/components/TierBadge.svelte';
	import { formatAbsolute, formatMbps, formatMs, shortId } from '$lib/format';

	let { data } = $props();

	let pills = $derived(
		[
			data.filters.tier && { k: 'tier', v: data.filters.tier },
			data.filters.deviceId && {
				k: 'deviceId',
				v: shortId(data.filters.deviceId)
			},
			data.filters.configVersion && { k: 'configVersion', v: data.filters.configVersion }
		].filter(Boolean) as { k: string; v: string }[]
	);

	let showingFrom = $derived(data.certs.total === 0 ? 0 : data.offset + 1);
	let showingTo = $derived(Math.min(data.offset + data.certs.items.length, data.certs.total));

	function buildHref(newOffset: number): string {
		const p = new URLSearchParams();
		if (data.filters.tier) p.set('tier', data.filters.tier);
		if (data.filters.deviceId) p.set('deviceId', data.filters.deviceId);
		if (data.filters.configVersion) p.set('configVersion', data.filters.configVersion);
		if (data.limit !== 50) p.set('limit', String(data.limit));
		if (newOffset !== 0) p.set('offset', String(newOffset));
		const qs = p.toString();
		return qs ? `/certs?${qs}` : '/certs';
	}

	let hasPrev = $derived(data.offset > 0);
	let hasNext = $derived(data.offset + data.limit < data.certs.total);
</script>

<PageHeader eyebrow="Stored runs" title="Certifications">
	{#snippet subtitle()}
		<span>
			Showing
			<span class="font-medium text-foreground">{showingFrom}–{showingTo}</span>
			of
			<span class="font-medium text-foreground">{data.certs.total.toLocaleString()}</span>
		</span>
	{/snippet}
</PageHeader>

{#if pills.length > 0}
	<div class="mb-4 flex flex-wrap items-center gap-2">
		<span class="text-xs text-muted">Filtered by:</span>
		{#each pills as p (p.k)}
			<span
				class="inline-flex items-center gap-1.5 rounded-md border border-pink-500/30 bg-pink-500/5 px-2 py-0.5 text-[11px] font-medium"
			>
				<span class="text-muted">{p.k}</span>
				<span class="font-mono text-pink-500">{p.v}</span>
			</span>
		{/each}
		<a href="/certs" class="ml-1 text-xs text-muted hover:text-foreground">clear</a>
	</div>
{/if}

<Section flush>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="hairline">
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">When</th>
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">ID</th>
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Device</th>
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Tier</th>
					<th class="px-4 py-3 text-right text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Down</th>
					<th class="px-4 py-3 text-right text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Up</th>
					<th class="px-4 py-3 text-right text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Latency</th>
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Widevine</th>
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Display</th>
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Config</th>
				</tr>
			</thead>
			<tbody>
				{#each data.certs.items as c (c.certificationId)}
					<tr class="border-b border-border transition-colors hover:bg-white/[0.025]">
						<td class="px-4 py-2.5 text-xs text-muted whitespace-nowrap">
							{formatAbsolute(c.receivedAt)}
						</td>
						<td class="px-4 py-2.5">
							<a
								href="/certs/{c.certificationId}"
								class="font-mono text-[13px] text-foreground transition-colors hover:text-pink-500"
							>
								{shortId(c.certificationId)}
							</a>
						</td>
						<td class="px-4 py-2.5">
							<a
								href="/devices/{c.deviceId}"
								class="font-mono text-xs text-muted transition-colors hover:text-pink-500"
							>
								{shortId(c.deviceId)}
							</a>
						</td>
						<td class="px-4 py-2.5">
							<TierBadge tier={c.achievedTier} />
						</td>
						<td class="tabular-nums px-4 py-2.5 text-right text-xs">
							{formatMbps(c.downloadSteadyMbps)}
						</td>
						<td class="tabular-nums px-4 py-2.5 text-right text-xs">
							{formatMbps(c.uploadSteadyMbps)}
						</td>
						<td class="tabular-nums px-4 py-2.5 text-right text-xs">
							{formatMs(c.latencyMedianMs)}
						</td>
						<td class="px-4 py-2.5 text-xs">{c.widevineLevel ?? '—'}</td>
						<td class="px-4 py-2.5 text-xs">
							{c.displayMaxHeight ? `${c.displayMaxHeight}p` : '—'}{c.hdrTypes && c.hdrTypes.length > 0
								? ' · HDR'
								: ''}
						</td>
						<td class="px-4 py-2.5 font-mono text-xs text-muted">{c.configVersion ?? '—'}</td>
					</tr>
				{/each}
				{#if data.certs.items.length === 0}
					<tr>
						<td colspan="10" class="px-4 py-12 text-center text-muted">No certifications match.</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</Section>

{#if hasPrev || hasNext}
	<div class="mt-4 flex items-center justify-end gap-2 text-sm">
		{#if hasPrev}
			<a
				href={buildHref(Math.max(0, data.offset - data.limit))}
				class="rounded-md border border-border px-3 py-1.5 text-muted transition-colors hover:bg-white/[0.03] hover:text-foreground"
			>
				← Prev
			</a>
		{:else}
			<span class="rounded-md border border-border/40 px-3 py-1.5 text-muted/40">← Prev</span>
		{/if}
		{#if hasNext}
			<a
				href={buildHref(data.offset + data.limit)}
				class="rounded-md border border-border px-3 py-1.5 text-muted transition-colors hover:bg-white/[0.03] hover:text-foreground"
			>
				Next →
			</a>
		{:else}
			<span class="rounded-md border border-border/40 px-3 py-1.5 text-muted/40">Next →</span>
		{/if}
	</div>
{/if}

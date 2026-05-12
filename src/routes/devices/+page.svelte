<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import TierBadge from '$lib/components/TierBadge.svelte';
	import { formatMbps, shortId } from '$lib/format';
	import LocalTime from '$lib/components/LocalTime.svelte';
	import type { CertSummary } from '$lib/types';

	let { data } = $props();

	type Rollup = {
		deviceId: string;
		hsn?: string;
		runs: number;
		latestTier: string;
		latestReceivedAt: string;
		avgDownload?: number;
	};

	function rollup(items: CertSummary[]): Rollup[] {
		const byDevice = new Map<string, Rollup>();
		const downloadAvgs = new Map<string, { sum: number; n: number }>();
		for (const c of items) {
			const existing = byDevice.get(c.deviceId);
			if (!existing) {
				byDevice.set(c.deviceId, {
					deviceId: c.deviceId,
					hsn: c.hsn,
					runs: 1,
					latestTier: c.achievedTier,
					latestReceivedAt: c.receivedAt
				});
			} else {
				existing.runs += 1;
			}
			if (c.downloadSteadyMbps != null) {
				const acc = downloadAvgs.get(c.deviceId) ?? { sum: 0, n: 0 };
				acc.sum += c.downloadSteadyMbps;
				acc.n += 1;
				downloadAvgs.set(c.deviceId, acc);
			}
		}
		for (const [id, acc] of downloadAvgs) {
			const r = byDevice.get(id);
			if (r) r.avgDownload = acc.sum / acc.n;
		}
		return [...byDevice.values()].sort(
			(a, b) => new Date(b.latestReceivedAt).getTime() - new Date(a.latestReceivedAt).getTime()
		);
	}

	let devices = $derived(rollup(data.certs.items));
</script>

<PageHeader eyebrow="Fleet inventory" title="Devices">
	{#snippet subtitle()}
		<span>
			<span class="font-medium text-foreground">{devices.length}</span> seen across the last
			{data.certs.items.length} certifications
		</span>
	{/snippet}
</PageHeader>

<Section flush>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="hairline">
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">HSN</th>
					<th class="px-4 py-3 text-right text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Runs</th>
					<th class="px-4 py-3 text-right text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Avg ↓</th>
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Latest tier</th>
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Last seen</th>
				</tr>
			</thead>
			<tbody>
				{#each devices as d (d.deviceId)}
					<tr class="border-b border-border transition-colors hover:bg-white/[0.025]">
						<td class="px-4 py-2.5">
							{#if d.hsn}
								{#if d.hsn.length === 64 && /^[0-9a-f]+$/.test(d.hsn)}
									<a
										href="/devices/{d.deviceId}"
										class="font-mono text-[13px] text-muted/70 transition-colors hover:text-pink-500"
										title="Legacy pre-policy hashed HSN"
									>
										{shortId(d.hsn)}…
									</a>
								{:else}
									<a
										href="/devices/{d.deviceId}"
										class="font-mono text-[13px] text-foreground transition-colors hover:text-pink-500"
									>
										{d.hsn}
									</a>
								{/if}
							{:else}
								<a
									href="/devices/{d.deviceId}"
									class="text-[13px] text-muted/70 italic transition-colors hover:text-pink-500"
									title="Older device — HSN not captured"
								>
									legacy device
								</a>
							{/if}
						</td>
						<td class="tabular-nums px-4 py-2.5 text-right text-xs">{d.runs}</td>
						<td class="tabular-nums px-4 py-2.5 text-right text-xs">{formatMbps(d.avgDownload)}</td>
						<td class="px-4 py-2.5"><TierBadge tier={d.latestTier} /></td>
						<td class="px-4 py-2.5 text-xs text-muted"><LocalTime iso={d.latestReceivedAt} /></td>
					</tr>
				{/each}
				{#if devices.length === 0}
					<tr>
						<td colspan="5" class="px-4 py-12 text-center text-muted">
							No devices have reported yet.
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</Section>

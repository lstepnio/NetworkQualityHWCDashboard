<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Kpi from '$lib/components/Kpi.svelte';
	import Section from '$lib/components/Section.svelte';
	import TierBadge from '$lib/components/TierBadge.svelte';
	import TierDistributionChart from '$lib/components/charts/TierDistributionChart.svelte';
	import ThroughputChart from '$lib/components/charts/ThroughputChart.svelte';
	import { formatMbps, formatMs, shortId } from '$lib/format';
	import LocalTime from '$lib/components/LocalTime.svelte';

	const TIERS = ['uhd_hdr', 'uhd', 'hd', 'sd', 'none'];

	let { data } = $props();

	let latest = $derived(data.certs.items[0]);
	let oldest = $derived(data.certs.items[data.certs.items.length - 1]);
	let distribution = $derived(
		TIERS.map((tier) => ({ tier, n: data.certs.items.filter((c) => c.achievedTier === tier).length }))
	);
	let throughput = $derived(
		[...data.certs.items].reverse().map((c) => ({
			receivedAt: c.receivedAt,
			download: c.downloadSteadyMbps,
			upload: c.uploadSteadyMbps
		}))
	);

	let downloads = $derived(
		data.certs.items.map((c) => c.downloadSteadyMbps).filter((v): v is number => v != null)
	);
	let latencies = $derived(
		data.certs.items.map((c) => c.latencyMedianMs).filter((v): v is number => v != null)
	);
	let avgDownload = $derived(downloads.length === 0 ? undefined : downloads.reduce((a, b) => a + b, 0) / downloads.length);
	let avgLatency = $derived(latencies.length === 0 ? undefined : Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length));
</script>

<PageHeader eyebrow="Device drill-down" title="{shortId(data.deviceId)}…">
	{#snippet subtitle()}
		<span class="flex flex-wrap items-center gap-3">
			<TierBadge tier={latest.achievedTier} />
			<span class="font-mono text-[11px] break-all text-muted">{data.deviceId}</span>
		</span>
	{/snippet}
	{#snippet actions()}
		<a href="/devices" class="text-sm text-muted hover:text-foreground">← All devices</a>
	{/snippet}
</PageHeader>

<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
	<Kpi label="Total runs" value={data.certs.total.toLocaleString()} emphasis />
	<Kpi label="Avg download" value={formatMbps(avgDownload)} />
	<Kpi label="Avg latency" value={formatMs(avgLatency)} />
	<Kpi label="First seen" mono>
		{#snippet value()}<LocalTime iso={oldest.receivedAt} />{/snippet}
		{#snippet hint()}last seen <LocalTime iso={latest.receivedAt} />{/snippet}
	</Kpi>
</div>

<div class="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
	<TierDistributionChart data={distribution} />
	<ThroughputChart data={throughput} />
</div>

<div class="mt-6">
	<Section title="Run history" description="{data.certs.total} runs" flush>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="hairline">
						<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">When</th>
						<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">ID</th>
						<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Tier</th>
						<th class="px-4 py-3 text-right text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Down</th>
						<th class="px-4 py-3 text-right text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Up</th>
						<th class="px-4 py-3 text-right text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Latency</th>
						<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Config</th>
					</tr>
				</thead>
				<tbody>
					{#each data.certs.items as c (c.certificationId)}
						<tr class="border-b border-border transition-colors hover:bg-white/[0.025]">
							<td class="px-4 py-2.5 text-xs text-muted whitespace-nowrap"><LocalTime iso={c.receivedAt} /></td>
							<td class="px-4 py-2.5">
								<a
									href="/certs/{c.certificationId}"
									class="font-mono text-[13px] text-foreground transition-colors hover:text-pink-500"
								>
									{shortId(c.certificationId)}
								</a>
							</td>
							<td class="px-4 py-2.5"><TierBadge tier={c.achievedTier} /></td>
							<td class="tabular-nums px-4 py-2.5 text-right text-xs">{formatMbps(c.downloadSteadyMbps)}</td>
							<td class="tabular-nums px-4 py-2.5 text-right text-xs">{formatMbps(c.uploadSteadyMbps)}</td>
							<td class="tabular-nums px-4 py-2.5 text-right text-xs">{formatMs(c.latencyMedianMs)}</td>
							<td class="px-4 py-2.5 font-mono text-xs text-muted">{c.configVersion ?? '—'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Section>
</div>

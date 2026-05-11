<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Kpi from '$lib/components/Kpi.svelte';
	import Section from '$lib/components/Section.svelte';
	import TierBadge from '$lib/components/TierBadge.svelte';
	import QueuedBadge from '$lib/components/QueuedBadge.svelte';
	import TierDistributionChart from '$lib/components/charts/TierDistributionChart.svelte';
	import ThroughputChart from '$lib/components/charts/ThroughputChart.svelte';
	import { formatMbps, formatMs, humanizeDelay, shortId } from '$lib/format';
	import LocalTime from '$lib/components/LocalTime.svelte';

	let { data } = $props();
	const TIERS = ['uhd_hdr', 'uhd', 'hd', 'sd', 'none'];

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
	let activeConfig = $derived(data.configs.items.find((c) => c.isActive));
	let premiumRate = $derived(
		data.certs.items.length === 0
			? '—'
			: `${Math.round(
					(data.certs.items.filter(
						(c) => c.achievedTier === 'uhd' || c.achievedTier === 'uhd_hdr'
					).length /
						data.certs.items.length) *
						100
				)}%`
	);
	let uniqueDevices = $derived(new Set(data.certs.items.map((c) => c.deviceId)).size);
	let latest = $derived(data.certs.items.slice(0, 5));
</script>

<PageHeader eyebrow="Fleet" title="Overview">
	{#snippet subtitle()}
		<span>
			{data.certs.total.toLocaleString()} stored certifications across
			<span class="font-medium text-foreground">{uniqueDevices}</span>
			{uniqueDevices === 1 ? 'device' : 'devices'}
		</span>
	{/snippet}
</PageHeader>

<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
	<Kpi label="Certifications" value={data.certs.total.toLocaleString()} hint="{data.certs.items.length} loaded" />
	<Kpi
		label="Active config"
		value={activeConfig?.configVersion ?? '—'}
		mono
		hint={activeConfig ? `schemaVersion ${activeConfig.schemaVersion}` : 'no active row'}
	/>
	<Kpi label="4K / 4K HDR rate" value={premiumRate} emphasis hint="last {data.certs.items.length} runs" />
	<Kpi label="Active devices" value={uniqueDevices} hint="last {data.certs.items.length} runs" />
</div>

<div class="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
	<TierDistributionChart data={distribution} />
	<ThroughputChart data={throughput} />
</div>

{#if data.queueStats}
	<div class="mt-6">
		<Section
			title="Publish-queue health"
			description="STBs queue results locally when the publish API is unavailable. Spikes mean the API was down or specific networks struggled."
		>
			<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
				<Kpi
					label="Sample (last 24h)"
					value={data.queueStats.sampleSize.toLocaleString()}
					hint="non-null submittedAt"
				/>
				<Kpi
					label="Median delay"
					value={humanizeDelay(data.queueStats.medianSeconds)}
					hint="50th percentile"
				/>
				<Kpi
					label="P95 delay"
					value={humanizeDelay(data.queueStats.p95Seconds)}
					hint="95th percentile"
				/>
				<Kpi
					label="Max delay"
					value={humanizeDelay(data.queueStats.maxSeconds)}
					hint="worst row in window"
					emphasis={data.queueStats.maxSeconds != null && data.queueStats.maxSeconds > 3600}
				/>
			</div>
		</Section>
	</div>
{/if}

<div class="mt-6">
	<Section title="Recent certifications" description="Latest five runs across the fleet" flush>
		{#if latest.length === 0}
			<div class="px-5 py-12 text-center text-sm text-muted">No certifications yet.</div>
		{:else}
			<ul class="divide-y divide-border">
				{#each latest as c (c.certificationId)}
					<li>
						<a
							href="/certs/{c.certificationId}"
							class="group flex items-center gap-4 px-5 py-3 transition-colors hover:bg-white/[0.03]"
						>
							<span class="w-[88px] shrink-0 font-mono text-xs text-muted">
								{shortId(c.certificationId)}
							</span>
							<TierBadge tier={c.achievedTier} />
							<QueuedBadge delaySeconds={c.queueDelaySeconds} />
							<span class="tabular-nums hidden text-xs text-muted lg:inline">
								{formatMbps(c.downloadSteadyMbps)} ↓ · {formatMbps(c.uploadSteadyMbps)} ↑ · {formatMs(
									c.latencyMedianMs
								)}
							</span>
							<span class="ml-auto text-xs text-muted">
								<LocalTime iso={c.completedAt} />
							</span>
							<span
								class="text-muted transition-colors group-hover:text-pink-500"
								style="opacity: 0.6;"
							>
								→
							</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</Section>
</div>

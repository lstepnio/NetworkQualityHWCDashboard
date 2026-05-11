<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Kpi from '$lib/components/Kpi.svelte';
	import Section from '$lib/components/Section.svelte';
	import TierBadge from '$lib/components/TierBadge.svelte';
	import QueuedBadge from '$lib/components/QueuedBadge.svelte';
	import JsonBlock from '$lib/components/JsonBlock.svelte';
	import { formatMbps, formatMs, humanizeDelay, shortId } from '$lib/format';
	import LocalTime from '$lib/components/LocalTime.svelte';

	let { data } = $props();
	const summary = $derived(data.detail.summary);
</script>

<PageHeader eyebrow="Certification" title="{shortId(summary.certificationId)}…">
	{#snippet subtitle()}
		<span class="flex flex-wrap items-center gap-3">
			<TierBadge tier={summary.achievedTier} />
			<span>Certified <LocalTime iso={summary.completedAt} /></span>
			<QueuedBadge delaySeconds={summary.queueDelaySeconds} />
		</span>
	{/snippet}
	{#snippet actions()}
		<a href="/certs" class="text-sm text-muted hover:text-foreground">← All certifications</a>
	{/snippet}
</PageHeader>

<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
	<Kpi label="Download" value={formatMbps(summary.downloadSteadyMbps)} emphasis />
	<Kpi label="Upload" value={formatMbps(summary.uploadSteadyMbps)} />
	<Kpi label="Latency (median)" value={formatMs(summary.latencyMedianMs)} />
	<Kpi label="Transport" value={summary.transport} />
</div>

<div class="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
	<Kpi label="Widevine" value={summary.widevineLevel ?? '—'} />
	<Kpi
		label="Display max"
		value={summary.displayMaxHeight ? `${summary.displayMaxHeight}p` : '—'}
	/>
	<Kpi
		label="HDR support"
		value={summary.hdrTypes.length === 0 ? 'none' : summary.hdrTypes.join(', ')}
	/>
	<Kpi label="Thermal" value={summary.thermalStatus ?? '—'} />
</div>

<div class="mt-6">
	<Section title="Identity & lineage" description="Hashed PII and the config this run used">
		<dl class="space-y-2.5 text-sm">
			<div class="grid grid-cols-[180px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">device_id</dt>
				<dd>
					<a
						href="/devices/{summary.deviceId}"
						class="font-mono text-xs break-all text-foreground transition-colors hover:text-pink-500"
					>
						{summary.deviceId} ↗
					</a>
				</dd>
			</div>
			<div class="grid grid-cols-[180px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">hsn / serial</dt>
				<dd class="font-mono text-xs break-all">
					{#if summary.hsn}
						{summary.hsn}
						{#if summary.hsn.length === 64 && /^[0-9a-f]+$/.test(summary.hsn)}
							<span class="text-muted">(legacy hash — pre-policy update)</span>
						{/if}
					{:else}
						—
					{/if}
				</dd>
			</div>
			<div class="grid grid-cols-[180px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">
					publicIp (hashed)
				</dt>
				<dd class="font-mono text-xs break-all">
					{summary.publicIpHash ?? '—'}
				</dd>
			</div>
			<div class="grid grid-cols-[180px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">config_version</dt>
				<dd class="font-mono text-xs">{summary.configVersion ?? '—'}</dd>
			</div>
			<div class="grid grid-cols-[180px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">started_at</dt>
				<dd><LocalTime iso={summary.startedAt} /></dd>
			</div>
			<div class="grid grid-cols-[180px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">completed_at</dt>
				<dd><LocalTime iso={summary.completedAt} /></dd>
			</div>
			<div class="grid grid-cols-[180px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">enqueued_at</dt>
				<dd><LocalTime iso={summary.enqueuedAt} /></dd>
			</div>
			<div
				class="grid grid-cols-[180px_1fr] items-start gap-3"
				title={summary.submittedAt
					? 'When the STB delivered this result'
					: 'Older client did not send submittedAt; falling back to received_at (request arrival time)'}
			>
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">received</dt>
				<dd>
					<LocalTime iso={summary.submittedAt ?? summary.receivedAt} />
					{#if summary.queueDelaySeconds != null && summary.queueDelaySeconds > 0}
						<span class="ml-2 text-xs text-muted">
							({humanizeDelay(summary.queueDelaySeconds)} after completion)
						</span>
					{:else if !summary.submittedAt}
						<span class="ml-2 text-xs text-muted">(legacy client; received_at fallback)</span>
					{/if}
				</dd>
			</div>
			<div class="grid grid-cols-[180px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">payload_hash</dt>
				<dd class="font-mono text-xs break-all">{data.detail.payloadHash}</dd>
			</div>
			<div class="grid grid-cols-[180px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">marginal_metric</dt>
				<dd>{summary.marginalMetric ?? '—'}</dd>
			</div>
		</dl>
	</Section>
</div>

<div class="mt-6">
	<Section title="Full payload" description="Raw CertificationResult as stored after PII redaction">
		<JsonBlock value={data.detail.payload} />
	</Section>
</div>

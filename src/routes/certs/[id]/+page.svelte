<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Kpi from '$lib/components/Kpi.svelte';
	import Section from '$lib/components/Section.svelte';
	import TierBadge from '$lib/components/TierBadge.svelte';
	import JsonBlock from '$lib/components/JsonBlock.svelte';
	import { formatAbsolute, formatMbps, formatMs, shortId } from '$lib/format';

	let { data } = $props();
	const summary = $derived(data.detail.summary);
</script>

<PageHeader eyebrow="Certification" title="{shortId(summary.certificationId)}…">
	{#snippet subtitle()}
		<span class="flex items-center gap-3">
			<TierBadge tier={summary.achievedTier} />
			<span>{formatAbsolute(summary.receivedAt)}</span>
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
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">hsn (hashed)</dt>
				<dd class="font-mono text-xs break-all">{summary.hsn ?? '—'}</dd>
			</div>
			<div class="grid grid-cols-[180px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">config_version</dt>
				<dd class="font-mono text-xs">{summary.configVersion ?? '—'}</dd>
			</div>
			<div class="grid grid-cols-[180px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">started_at</dt>
				<dd>{formatAbsolute(summary.startedAt)}</dd>
			</div>
			<div class="grid grid-cols-[180px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">completed_at</dt>
				<dd>{formatAbsolute(summary.completedAt)}</dd>
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

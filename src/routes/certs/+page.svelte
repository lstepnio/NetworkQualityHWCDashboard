<script lang="ts">
	import { Search } from 'lucide-svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import TierBadge from '$lib/components/TierBadge.svelte';
	import WifiBadge from '$lib/components/WifiBadge.svelte';
	import QueuedBadge from '$lib/components/QueuedBadge.svelte';
	import { formatMbps, formatMs, shortId } from '$lib/format';
	import LocalTime from '$lib/components/LocalTime.svelte';
	import TzToggle from '$lib/components/TzToggle.svelte';

	let { data } = $props();

	let hsnInput = $state(data.filters.hsn ?? '');
	let publicIpInput = $state(data.filters.publicIp ?? '');

	let pills = $derived(
		[
			data.filters.tier && { k: 'tier', v: data.filters.tier },
			data.filters.deviceId && {
				k: 'deviceId',
				v: shortId(data.filters.deviceId)
			},
			data.filters.configVersion && { k: 'configVersion', v: data.filters.configVersion },
			data.filters.hsn && { k: 'hsn', v: data.filters.hsn },
			data.filters.publicIp && { k: 'publicIp', v: data.filters.publicIp },
			data.filters.queuedOnly && { k: 'queuedOnly', v: 'true' }
		].filter(Boolean) as { k: string; v: string }[]
	);

	let showingFrom = $derived(data.certs.total === 0 ? 0 : data.offset + 1);
	let showingTo = $derived(Math.min(data.offset + data.certs.items.length, data.certs.total));

	function baseParams(): URLSearchParams {
		const p = new URLSearchParams();
		if (data.filters.tier) p.set('tier', data.filters.tier);
		if (data.filters.deviceId) p.set('deviceId', data.filters.deviceId);
		if (data.filters.configVersion) p.set('configVersion', data.filters.configVersion);
		if (data.filters.hsn) p.set('hsn', data.filters.hsn);
		if (data.filters.publicIp) p.set('publicIp', data.filters.publicIp);
		if (data.filters.queuedOnly) p.set('queuedOnly', 'true');
		if (data.limit !== 50) p.set('limit', String(data.limit));
		return p;
	}

	function buildHref(newOffset: number): string {
		const p = baseParams();
		if (data.sort) p.set('sort', data.sort);
		if (data.dir) p.set('dir', data.dir);
		if (newOffset !== 0) p.set('offset', String(newOffset));
		const qs = p.toString();
		return qs ? `/certs?${qs}` : '/certs';
	}

	// Toggle order on the same column, otherwise switch column and start
	// at desc — most users want "biggest/most-recent first" by default.
	function sortHref(col: string): string {
		const p = baseParams();
		let nextDir: 'asc' | 'desc' = 'desc';
		if (data.sort === col && data.dir !== 'asc') nextDir = 'asc';
		p.set('sort', col);
		p.set('dir', nextDir);
		return `/certs?${p.toString()}`;
	}

	function sortArrow(col: string): string {
		if (data.sort !== col) return '';
		return data.dir === 'asc' ? ' ↑' : ' ↓';
	}

	const thLeft =
		'px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase';
	const thRight =
		'px-4 py-3 text-right text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase';
	const sortLink = 'inline-flex items-center gap-1 transition-colors hover:text-foreground';

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

<form
	method="GET"
	class="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto_auto]"
	data-sveltekit-keepfocus
>
	<label class="relative">
		<Search class="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted" strokeWidth={2} />
		<input
			type="text"
			name="hsn"
			bind:value={hsnInput}
			placeholder="Search by HSN / serial (e.g. E44AW3251919440)"
			class="w-full rounded-md border border-border bg-surface-2/60 py-2 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
		/>
	</label>
	<label class="relative">
		<Search class="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted" strokeWidth={2} />
		<input
			type="text"
			name="publicIp"
			bind:value={publicIpInput}
			placeholder="Search by WAN IP (e.g. 203.0.113.5)"
			class="w-full rounded-md border border-border bg-surface-2/60 py-2 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
		/>
	</label>
	<button
		type="submit"
		class="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-600"
	>
		Search
	</button>
	{#if pills.length > 0}
		<a
			href="/certs"
			class="rounded-md border border-border px-3 py-2 text-center text-sm text-muted transition-colors hover:bg-white/[0.03] hover:text-foreground"
		>
			Clear
		</a>
	{/if}
	<!-- Carry through filters that the form doesn't expose explicitly so a
	     search inside an existing tier-filtered view doesn't widen the scope. -->
	{#if data.filters.tier}<input type="hidden" name="tier" value={data.filters.tier} />{/if}
	{#if data.filters.deviceId}
		<input type="hidden" name="deviceId" value={data.filters.deviceId} />
	{/if}
	{#if data.filters.configVersion}
		<input type="hidden" name="configVersion" value={data.filters.configVersion} />
	{/if}
	{#if data.filters.queuedOnly}
		<input type="hidden" name="queuedOnly" value="true" />
	{/if}
</form>

<div class="mb-4 flex items-center gap-3 text-sm">
	{#if data.filters.queuedOnly}
		<a
			href={(() => {
				const p = baseParams();
				p.delete('queuedOnly');
				if (data.sort) p.set('sort', data.sort);
				if (data.dir) p.set('dir', data.dir);
				const qs = p.toString();
				return qs ? `/certs?${qs}` : '/certs';
			})()}
			class="inline-flex items-center gap-2 rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-400/15"
		>
			<span class="size-1.5 rounded-full bg-amber-400"></span>
			Showing queue-delayed only (&gt; 5 min) — click to clear
		</a>
	{:else}
		<a
			href={(() => {
				const p = baseParams();
				p.set('queuedOnly', 'true');
				if (data.sort) p.set('sort', data.sort);
				if (data.dir) p.set('dir', data.dir);
				return `/certs?${p.toString()}`;
			})()}
			class="text-xs text-muted hover:text-foreground"
		>
			Show only queue-delayed (&gt; 5 min)
		</a>
	{/if}
</div>

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
	</div>
{/if}

<Section flush>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="hairline">
					<th class={thLeft}>
							<a href={sortHref('completed')} class={sortLink}>Certified{sortArrow('completed')}</a><TzToggle />
						</th>
					<th class={thLeft}><a href={sortHref('hsn')} class={sortLink}>HSN{sortArrow('hsn')}</a></th>
					<th class={thLeft}><a href={sortHref('tier')} class={sortLink}>Tier{sortArrow('tier')}</a></th>
					<th class={thRight}><a href={sortHref('download')} class={sortLink}>Down{sortArrow('download')}</a></th>
					<th class={thRight}><a href={sortHref('upload')} class={sortLink}>Up{sortArrow('upload')}</a></th>
					<th class={thRight}><a href={sortHref('latency')} class={sortLink}>Latency{sortArrow('latency')}</a></th>
					<th class={thLeft}><a href={sortHref('wifi')} class={sortLink}>WiFi{sortArrow('wifi')}</a></th>
					<th class={thLeft}>Display</th>
					<th class={thLeft}><a href={sortHref('config')} class={sortLink}>Config{sortArrow('config')}</a></th>
				</tr>
			</thead>
			<tbody>
				{#each data.certs.items as c (c.certificationId)}
					<tr class="border-b border-border transition-colors hover:bg-white/[0.025]">
						<td class="px-4 py-2.5 text-xs whitespace-nowrap">
							<a
								href="/certs/{c.certificationId}"
								class="text-foreground transition-colors hover:text-pink-500"
							>
								<LocalTime iso={c.completedAt} />
							</a>
							{#if c.queueDelaySeconds != null && c.queueDelaySeconds > 300}
								<div class="mt-1">
									<QueuedBadge delaySeconds={c.queueDelaySeconds} />
								</div>
							{/if}
						</td>
						<td class="px-4 py-2.5">
							{#if c.hsn}
								{#if c.hsn.length === 64 && /^[0-9a-f]+$/.test(c.hsn)}
									<a
										href="/devices/{c.hsn ?? c.deviceId}"
										class="font-mono text-xs text-muted/70 transition-colors hover:text-pink-500"
										title="Legacy pre-policy hashed HSN — click to open device"
									>
										{shortId(c.hsn)}…
									</a>
								{:else}
									<a
										href="/devices/{c.hsn ?? c.deviceId}"
										class="font-mono text-xs text-foreground transition-colors hover:text-pink-500"
									>
										{c.hsn}
									</a>
								{/if}
							{:else}
								<a
									href="/devices/{c.hsn ?? c.deviceId}"
									class="text-xs text-muted/70 italic transition-colors hover:text-pink-500"
									title="Older device — HSN not captured"
								>
									legacy
								</a>
							{/if}
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
						<td class="px-4 py-2.5">
							{#if c.wifiRating || c.wifiRssiDbm != null}
								<div class="flex items-center gap-2">
									<WifiBadge rating={c.wifiRating} />
									{#if c.wifiRssiDbm != null}
										<span class="tabular-nums text-[11px] text-muted">{c.wifiRssiDbm} dBm</span>
									{/if}
								</div>
							{:else}
								<span class="text-xs text-muted">—</span>
							{/if}
						</td>
						<td class="px-4 py-2.5 text-xs">
							{c.displayMaxHeight ? `${c.displayMaxHeight}p` : '—'}
						</td>
						<td class="px-4 py-2.5 font-mono text-xs text-muted">{c.configVersion ?? '—'}</td>
					</tr>
				{/each}
				{#if data.certs.items.length === 0}
					<tr>
						<td colspan="9" class="px-4 py-12 text-center text-muted">No certifications match.</td>
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

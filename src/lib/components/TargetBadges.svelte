<script lang="ts">
	// Renders the per-device targeting selectors for a cert-config row.
	// Contract v2.2.0: targetManufacturer / targetModel / targetBuildFingerprint
	// are all optional. When all three are null/empty the row is the "default"
	// catch-all and we render a muted, italic placeholder. Otherwise we render
	// a chip stack mfr · model · fingerprint with null slots dimmed.
	let {
		manufacturer,
		model,
		fingerprint,
		// Truncate fingerprint to this many chars in the chip; full value is
		// always available via the title tooltip on hover.
		fingerprintMaxChars = 24
	}: {
		manufacturer?: string | null;
		model?: string | null;
		fingerprint?: string | null;
		fingerprintMaxChars?: number;
	} = $props();

	const mfr = $derived(manufacturer && manufacturer.length > 0 ? manufacturer : null);
	const mdl = $derived(model && model.length > 0 ? model : null);
	const fp = $derived(fingerprint && fingerprint.length > 0 ? fingerprint : null);
	const isDefault = $derived(mfr === null && mdl === null && fp === null);

	const truncatedFp = $derived(
		fp === null
			? null
			: fp.length > fingerprintMaxChars
				? `${fp.slice(0, fingerprintMaxChars)}…`
				: fp
	);
</script>

{#if isDefault}
	<span class="text-xs text-muted italic">default</span>
{:else}
	<span class="inline-flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
		{#if mfr}
			<span
				class="inline-flex items-center rounded border border-border bg-white/[0.03] px-1.5 py-0.5 text-foreground"
				title={`manufacturer: ${mfr}`}>{mfr}</span
			>
		{:else}
			<span
				class="inline-flex items-center rounded border border-border/60 px-1.5 py-0.5 text-muted-foreground/60"
				title="manufacturer: any">·</span
			>
		{/if}
		{#if mdl}
			<span
				class="inline-flex items-center rounded border border-border bg-white/[0.03] px-1.5 py-0.5 text-foreground"
				title={`model: ${mdl}`}>{mdl}</span
			>
		{:else}
			<span
				class="inline-flex items-center rounded border border-border/60 px-1.5 py-0.5 text-muted-foreground/60"
				title="model: any">·</span
			>
		{/if}
		{#if fp && truncatedFp}
			<span
				class="inline-flex items-center rounded border border-border bg-white/[0.03] px-1.5 py-0.5 text-foreground"
				title={`fingerprint: ${fp}`}>{truncatedFp}</span
			>
		{:else}
			<span
				class="inline-flex items-center rounded border border-border/60 px-1.5 py-0.5 text-muted-foreground/60"
				title="fingerprint: any">·</span
			>
		{/if}
	</span>
{/if}

<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import JsonBlock from '$lib/components/JsonBlock.svelte';
	import { formatAbsolute } from '$lib/format';

	let { data } = $props();
	const c = $derived(data.config);
</script>

<PageHeader eyebrow="Configuration" title={c.configVersion}>
	{#snippet subtitle()}
		<span class="flex flex-wrap items-center gap-3">
			{#if c.isActive}
				<span
					class="inline-flex items-center gap-1.5 rounded-md border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 text-[11px] font-medium tracking-[0.08em] text-pink-500 uppercase"
				>
					<span
						class="size-1.5 rounded-full bg-pink-500"
						style="box-shadow: 0 0 6px rgba(238,61,91,0.7);"
					></span>
					Active
				</span>
			{:else}
				<span
					class="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-[11px] font-medium tracking-[0.08em] text-muted uppercase"
				>
					Inactive
				</span>
			{/if}
			<span>schemaVersion {c.schemaVersion}</span>
			<span class="text-muted">·</span>
			<span>created {formatAbsolute(c.createdAt)}</span>
		</span>
	{/snippet}
	{#snippet actions()}
		<a href="/configs" class="text-sm text-muted hover:text-foreground">← All configs</a>
	{/snippet}
</PageHeader>

<Section title="Document" description="Returned verbatim from GET /v1/cert-config">
	<JsonBlock value={c.document ?? {}} />
</Section>

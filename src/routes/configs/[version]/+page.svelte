<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import JsonBlock from '$lib/components/JsonBlock.svelte';
	import LocalTime from '$lib/components/LocalTime.svelte';

	let { data, form } = $props();
	let activating = $state(false);
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
			<span>created <LocalTime iso={c.createdAt} /></span>
		</span>
	{/snippet}
	{#snippet actions()}
		<a href="/configs" class="text-sm text-muted hover:text-foreground">← All configs</a>
	{/snippet}
</PageHeader>

<div class="mb-4 flex flex-wrap items-center gap-3">
	{#if !c.isActive}
		<form
			method="POST"
			action="?/activate"
			use:enhance={() => {
				activating = true;
				return async ({ update }) => {
					await update();
					activating = false;
				};
			}}
		>
			<button
				type="submit"
				disabled={activating}
				class="inline-flex items-center gap-2 rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
			>
				{activating ? 'Promoting…' : 'Promote to active'}
				{#if data.activeVersion}
					<span class="text-pink-100/80 text-xs">(replaces {data.activeVersion})</span>
				{/if}
			</button>
		</form>
	{/if}
	<a
		href="/configs/new?from={encodeURIComponent(c.configVersion)}"
		class="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.03]"
	>
		Clone & edit
	</a>
</div>

{#if form?.error}
	<div
		class="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
	>
		{form.error}
	</div>
{/if}

{#if form?.success}
	<div
		class="mb-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
	>
		Activated. STBs pick up the new config on their next launch fetch.
	</div>
{/if}

<Section title="Document" description="Returned verbatim from GET /v1/cert-config">
	<JsonBlock value={c.document ?? {}} />
</Section>

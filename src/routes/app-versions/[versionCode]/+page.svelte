<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import JsonBlock from '$lib/components/JsonBlock.svelte';
	import { formatAbsolute, formatBytes } from '$lib/format';

	let { data, form } = $props();
	let activating = $state(false);
	const v = $derived(data.version);
	const doc = $derived((v.document ?? {}) as Record<string, unknown>);
	const apkSizeBytes = $derived(typeof doc.apkSizeBytes === 'number' ? doc.apkSizeBytes : null);
</script>

<PageHeader eyebrow="App release" title={v.latestVersionName}>
	{#snippet subtitle()}
		<span class="flex flex-wrap items-center gap-3">
			{#if v.isActive}
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
			<span class="tabular-nums">code {v.latestVersionCode}</span>
			<span class="text-muted">·</span>
			<span class="tabular-nums">min ≥ {v.minRequiredVersionCode}</span>
			{#if v.publishedAt}
				<span class="text-muted">·</span>
				<span>published {formatAbsolute(v.publishedAt)}</span>
			{/if}
		</span>
	{/snippet}
	{#snippet actions()}
		<a href="/app-versions" class="text-sm text-muted hover:text-foreground">← All releases</a>
	{/snippet}
</PageHeader>

<div class="mb-4 flex flex-wrap items-center gap-3">
	{#if !v.isActive}
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
				{#if data.activeCode}
					<span class="text-pink-100/80 text-xs">(replaces code {data.activeCode})</span>
				{/if}
			</button>
		</form>
	{/if}
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
		Activated. STBs pick up the new manifest on their next launch fetch and gate their cert button against the new <code class="font-mono">minRequiredVersionCode</code>.
	</div>
{/if}

<div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
	<Section title="APK" description="What the STB downloads, with integrity pins">
		<dl class="space-y-2.5 text-sm">
			<div class="grid grid-cols-[140px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">URL</dt>
				<dd class="font-mono text-xs break-all">
					{#if typeof doc.apkUrl === 'string'}
						<a href={doc.apkUrl} class="text-foreground hover:text-pink-500" target="_blank" rel="noopener">
							{doc.apkUrl}
						</a>
					{:else}
						—
					{/if}
				</dd>
			</div>
			<div class="grid grid-cols-[140px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">Size</dt>
				<dd class="tabular-nums">
					{formatBytes(apkSizeBytes)}
					{#if apkSizeBytes != null}
						<span class="ml-2 font-mono text-xs text-muted">({apkSizeBytes.toLocaleString()} bytes)</span>
					{/if}
				</dd>
			</div>
			<div class="grid grid-cols-[140px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">APK SHA-256</dt>
				<dd class="font-mono text-xs break-all">{(doc.apkSha256 as string) ?? '—'}</dd>
			</div>
			<div class="grid grid-cols-[140px_1fr] items-start gap-3">
				<dt class="pt-0.5 text-xs font-medium tracking-[0.12em] text-muted uppercase">
					Cert SHA-256
				</dt>
				<dd class="font-mono text-xs break-all">{(doc.signingCertSha256 as string) ?? '—'}</dd>
			</div>
		</dl>
	</Section>

	<Section title="Release notes" description="Surfaced to the field tech in the update banner">
		{#if typeof doc.releaseNotes === 'string' && doc.releaseNotes.length > 0}
			<p class="text-sm whitespace-pre-wrap text-foreground/90">{doc.releaseNotes}</p>
		{:else}
			<p class="text-sm text-muted">No release notes.</p>
		{/if}
	</Section>
</div>

<div class="mt-6">
	<Section title="Document" description="Verbatim JSON returned by GET /v1/app/version">
		<JsonBlock value={v.document ?? {}} />
	</Section>
</div>

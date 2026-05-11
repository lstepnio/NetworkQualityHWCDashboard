<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';

	let { data, form } = $props();
	let saving = $state(false);

	// Pre-fill from the latest existing release where it makes sense:
	// minRequired sticks (you usually don't move the floor every release),
	// apkUrl swaps the version segment but keeps the host, SHAs reset.
	const latest = data.latest;
	const suggestedCode = latest ? latest.latestVersionCode + 1 : 1;
	const suggestedName = latest ? bumpPatch(latest.latestVersionName) : '0.1.0';
	const suggestedMinRequired = latest ? latest.minRequiredVersionCode : suggestedCode;

	function bumpPatch(name: string): string {
		const m = name.match(/^(\d+)\.(\d+)\.(\d+)(.*)$/);
		if (!m) return name;
		return `${m[1]}.${m[2]}.${Number(m[3]) + 1}${m[4] ?? ''}`;
	}

	function recoverValue(k: string, fallback: string): string {
		const v = (form?.values as Record<string, string> | undefined)?.[k];
		return v ?? fallback;
	}
</script>

<PageHeader eyebrow="New release" title="App version manifest">
	{#snippet subtitle()}
		<span>
			Publishes as <strong>inactive</strong>; promote separately. STBs pick up the new manifest on their next launch.
		</span>
	{/snippet}
	{#snippet actions()}
		<a href="/app-versions" class="text-sm text-muted hover:text-foreground">← All releases</a>
	{/snippet}
</PageHeader>

{#if form?.error}
	<div
		class="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm whitespace-pre-wrap text-red-200"
	>
		{form.error}
	</div>
{/if}

<form
	method="POST"
	use:enhance={() => {
		saving = true;
		return async ({ update }) => {
			await update();
			saving = false;
		};
	}}
	class="space-y-4"
>
	<Section title="Identity" description="versionName is what humans see; versionCode is the monotonic build counter">
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<label class="block">
				<span class="mb-1 block text-xs font-medium tracking-wide text-muted uppercase">
					Version name
				</span>
				<input
					type="text"
					name="latestVersionName"
					value={recoverValue('latestVersionName', suggestedName)}
					required
					placeholder="0.7.0"
					class="w-full rounded-md border border-border bg-surface-2/60 px-3 py-2 text-sm text-foreground focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
				/>
			</label>
			<label class="block">
				<span class="mb-1 block text-xs font-medium tracking-wide text-muted uppercase">
					Version code
				</span>
				<input
					type="number"
					name="latestVersionCode"
					value={recoverValue('latestVersionCode', String(suggestedCode))}
					min="1"
					required
					class="tabular-nums w-full rounded-md border border-border bg-surface-2/60 px-3 py-2 text-sm text-foreground focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
				/>
			</label>
			<label class="block">
				<span class="mb-1 block text-xs font-medium tracking-wide text-muted uppercase">
					Min required code
				</span>
				<input
					type="number"
					name="minRequiredVersionCode"
					value={recoverValue('minRequiredVersionCode', String(suggestedMinRequired))}
					min="1"
					required
					class="tabular-nums w-full rounded-md border border-border bg-surface-2/60 px-3 py-2 text-sm text-foreground focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
				/>
				<p class="mt-1 text-[11px] text-muted">Floor below which the cert button is blocked. Must be ≤ version code.</p>
			</label>
		</div>
	</Section>

	<Section title="APK" description="URL must be HTTPS in production; SHA-256s are lowercase hex">
		<div class="space-y-4">
			<label class="block">
				<span class="mb-1 block text-xs font-medium tracking-wide text-muted uppercase">
					APK URL
				</span>
				<input
					type="url"
					name="apkUrl"
					value={recoverValue('apkUrl', '')}
					required
					placeholder="https://certifier-api.gethotwired.com/v1/app/download/0.7.0.apk"
					class="w-full rounded-md border border-border bg-surface-2/60 px-3 py-2 font-mono text-xs text-foreground focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
				/>
			</label>
			<label class="block">
				<span class="mb-1 block text-xs font-medium tracking-wide text-muted uppercase">
					APK size (bytes)
				</span>
				<input
					type="number"
					name="apkSizeBytes"
					value={recoverValue('apkSizeBytes', '')}
					min="1"
					required
					class="tabular-nums w-full rounded-md border border-border bg-surface-2/60 px-3 py-2 text-sm text-foreground focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
				/>
				<p class="mt-1 text-[11px] text-muted"><code>stat -f%z file.apk</code> (macOS) or <code>stat -c%s file.apk</code> (Linux)</p>
			</label>
			<label class="block">
				<span class="mb-1 block text-xs font-medium tracking-wide text-muted uppercase">
					APK SHA-256
				</span>
				<input
					type="text"
					name="apkSha256"
					value={recoverValue('apkSha256', '')}
					pattern="[0-9a-fA-F]{'{'}64{'}'}"
					required
					placeholder="64-char lowercase hex"
					class="w-full rounded-md border border-border bg-surface-2/60 px-3 py-2 font-mono text-xs text-foreground focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
				/>
				<p class="mt-1 text-[11px] text-muted"><code>shasum -a 256 file.apk</code></p>
			</label>
			<label class="block">
				<span class="mb-1 block text-xs font-medium tracking-wide text-muted uppercase">
					Signing cert SHA-256
				</span>
				<input
					type="text"
					name="signingCertSha256"
					value={recoverValue('signingCertSha256', '')}
					pattern="[0-9a-fA-F]{'{'}64{'}'}"
					required
					placeholder="64-char lowercase hex"
					class="w-full rounded-md border border-border bg-surface-2/60 px-3 py-2 font-mono text-xs text-foreground focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
				/>
				<p class="mt-1 text-[11px] text-muted">SHA-256 of the v2/v3 signing certificate. Stays constant across releases that use the same keystore.</p>
			</label>
		</div>
	</Section>

	<Section title="Metadata" description="Optional human-facing fields">
		<div class="space-y-4">
			<label class="block">
				<span class="mb-1 block text-xs font-medium tracking-wide text-muted uppercase">
					Release notes
				</span>
				<textarea
					name="releaseNotes"
					rows="3"
					placeholder="What changed in this release"
					class="w-full resize-y rounded-md border border-border bg-surface-2/60 px-3 py-2 text-sm text-foreground focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
				>{recoverValue('releaseNotes', '')}</textarea>
			</label>
			<label class="block">
				<span class="mb-1 block text-xs font-medium tracking-wide text-muted uppercase">
					Published at
				</span>
				<input
					type="datetime-local"
					name="publishedAt"
					value={recoverValue('publishedAt', '')}
					class="w-full rounded-md border border-border bg-surface-2/60 px-3 py-2 text-sm text-foreground focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
				/>
				<p class="mt-1 text-[11px] text-muted">Optional. Defaults to unset; informational only.</p>
			</label>
		</div>
	</Section>

	<div class="flex items-center justify-end gap-3">
		<a href="/app-versions" class="text-sm text-muted hover:text-foreground">Cancel</a>
		<button
			type="submit"
			disabled={saving}
			class="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
		>
			{saving ? 'Saving…' : 'Save as draft'}
		</button>
	</div>
</form>

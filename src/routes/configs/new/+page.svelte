<script lang="ts">
	import { enhance } from '$app/forms';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';

	let { data, form } = $props();

	// On first render, pre-fill with the active or `?from=` template.
	// On a failed submit (form set), use what the user submitted so they
	// don't lose their edits.
	let document = $state(form?.document ?? JSON.stringify(data.template ?? {}, null, 2));
	let saving = $state(false);

	function bumpVersion() {
		try {
			const doc = JSON.parse(document);
			const today = new Date().toISOString().slice(0, 10);
			const cv = String(doc.configVersion ?? '');
			let next = `${today}.dev.1`;
			const m = cv.match(/^(\d{4}-\d{2}-\d{2})(?:\.(\w+))?\.(\d+)$/);
			if (m && m[1] === today) {
				next = `${m[1]}${m[2] ? `.${m[2]}` : '.dev'}.${Number(m[3]) + 1}`;
			} else if (m) {
				next = `${today}${m[2] ? `.${m[2]}` : '.dev'}.1`;
			}
			doc.configVersion = next;
			document = JSON.stringify(doc, null, 2);
		} catch {
			/* leave document untouched if JSON is currently invalid */
		}
	}

	let parsedConfigVersion = $derived.by(() => {
		try {
			return String(JSON.parse(document)?.configVersion ?? '');
		} catch {
			return '';
		}
	});
</script>

<PageHeader eyebrow="New configuration" title={parsedConfigVersion || 'Draft'}>
	{#snippet subtitle()}
		<span>
			{#if data.templateVersion}
				Cloned from <span class="font-mono text-foreground">{data.templateVersion}</span>. Saves as
				inactive — promote separately.
			{:else}
				Empty starting point. Saves as inactive — promote separately.
			{/if}
		</span>
	{/snippet}
	{#snippet actions()}
		<a href="/configs" class="text-sm text-muted hover:text-foreground">← All configs</a>
	{/snippet}
</PageHeader>

{#if form?.error}
	<div
		class="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
	>
		{form.error}
	</div>
{/if}

<form method="POST" use:enhance={() => {
	saving = true;
	return async ({ update }) => {
		await update();
		saving = false;
	};
}} class="space-y-4">
	<Section
		title="Document"
		description="Full CertConfig JSON. configVersion must be unique; schemaVersion >= 1."
	>
		<div class="mb-3 flex flex-wrap gap-2">
			<button
				type="button"
				onclick={bumpVersion}
				class="rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-muted transition-colors hover:bg-white/[0.03] hover:text-foreground"
			>
				Bump configVersion
			</button>
			<button
				type="button"
				onclick={() => (document = JSON.stringify(data.template ?? {}, null, 2))}
				class="rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-muted transition-colors hover:bg-white/[0.03] hover:text-foreground"
			>
				Reset to template
			</button>
		</div>
		<textarea
			name="document"
			bind:value={document}
			rows="32"
			spellcheck="false"
			class="block w-full resize-y rounded-md border border-border bg-surface-2/60 p-4 font-mono text-xs leading-relaxed text-foreground focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
		></textarea>
	</Section>

	<div class="flex items-center justify-end gap-3">
		<a href="/configs" class="text-sm text-muted hover:text-foreground">Cancel</a>
		<button
			type="submit"
			disabled={saving}
			class="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-600 disabled:opacity-50"
		>
			{saving ? 'Saving…' : 'Save as draft'}
		</button>
	</div>
</form>

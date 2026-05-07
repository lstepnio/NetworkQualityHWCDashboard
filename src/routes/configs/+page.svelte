<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import { formatAbsolute } from '$lib/format';

	let { data } = $props();
</script>

<PageHeader eyebrow="Server-driven runtime" title="Configurations">
	{#snippet subtitle()}
		<span>
			<span class="font-medium text-foreground">{data.configs.total}</span>
			{data.configs.total === 1 ? 'row' : 'rows'} · exactly one is active at a time
		</span>
	{/snippet}
</PageHeader>

<Section flush>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="hairline">
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Version</th>
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Schema</th>
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">State</th>
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">Created</th>
				</tr>
			</thead>
			<tbody>
				{#each data.configs.items as c (c.configVersion)}
					<tr class="border-b border-border transition-colors hover:bg-white/[0.025]">
						<td class="px-4 py-2.5 font-mono">
							<a
								href="/configs/{encodeURIComponent(c.configVersion)}"
								class="text-foreground transition-colors hover:text-pink-500"
							>
								{c.configVersion}
							</a>
						</td>
						<td class="tabular-nums px-4 py-2.5 text-xs text-muted">v{c.schemaVersion}</td>
						<td class="px-4 py-2.5">
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
						</td>
						<td class="px-4 py-2.5 text-xs text-muted">{formatAbsolute(c.createdAt)}</td>
					</tr>
				{/each}
				{#if data.configs.items.length === 0}
					<tr><td colspan="4" class="px-4 py-12 text-center text-muted">No configs.</td></tr>
				{/if}
			</tbody>
		</table>
	</div>
</Section>

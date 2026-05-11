<script lang="ts">
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Section from '$lib/components/Section.svelte';
	import LocalTime from '$lib/components/LocalTime.svelte';

	let { data } = $props();
</script>

<PageHeader eyebrow="Self-update manifests" title="App Versions">
	{#snippet subtitle()}
		<span>
			<span class="font-medium text-foreground">{data.versions.total}</span>
			{data.versions.total === 1 ? 'release' : 'releases'} · exactly one active at a time. The active manifest is what `GET /v1/app/version` returns.
		</span>
	{/snippet}
	{#snippet actions()}
		<a
			href="/app-versions/new"
			class="rounded-md bg-pink-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-pink-600"
		>
			New release
		</a>
	{/snippet}
</PageHeader>

<Section flush>
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead>
				<tr class="hairline">
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">
						Version
					</th>
					<th class="px-4 py-3 text-right text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">
						Code
					</th>
					<th class="px-4 py-3 text-right text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">
						Min required
					</th>
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">
						State
					</th>
					<th class="px-4 py-3 text-left text-[10.5px] font-medium tracking-[0.14em] text-muted uppercase">
						Published
					</th>
				</tr>
			</thead>
			<tbody>
				{#each data.versions.items as v (v.latestVersionCode)}
					<tr class="border-b border-border transition-colors hover:bg-white/[0.025]">
						<td class="px-4 py-2.5">
							<a
								href="/app-versions/{v.latestVersionCode}"
								class="font-mono text-[13px] text-foreground transition-colors hover:text-pink-500"
							>
								{v.latestVersionName}
							</a>
						</td>
						<td class="tabular-nums px-4 py-2.5 text-right text-xs">{v.latestVersionCode}</td>
						<td class="tabular-nums px-4 py-2.5 text-right text-xs text-muted">
							≥ {v.minRequiredVersionCode}
						</td>
						<td class="px-4 py-2.5">
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
						</td>
						<td class="px-4 py-2.5 text-xs text-muted">
							<LocalTime iso={v.publishedAt} />
						</td>
					</tr>
				{/each}
				{#if data.versions.items.length === 0}
					<tr>
						<td colspan="5" class="px-4 py-12 text-center text-muted">
							No releases yet. <a href="/app-versions/new" class="text-pink-500 hover:underline">Create the first manifest</a>.
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</Section>

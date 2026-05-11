<script lang="ts">
	import { page } from '$app/state';
	import Logo from './Logo.svelte';
	import { Activity, FileText, MonitorSmartphone, Package, Settings2 } from 'lucide-svelte';

	const links = [
		{ href: '/', label: 'Overview', icon: Activity },
		{ href: '/certs', label: 'Certifications', icon: FileText },
		{ href: '/devices', label: 'Devices', icon: MonitorSmartphone },
		{ href: '/configs', label: 'Configurations', icon: Settings2 },
		{ href: '/app-versions', label: 'App Versions', icon: Package }
	];

	function isActive(href: string, path: string): boolean {
		if (href === '/') return path === '/';
		return path === href || path.startsWith(`${href}/`);
	}
</script>

<aside
	class="hidden w-60 shrink-0 flex-col border-r border-border bg-surface-1 md:flex"
	aria-label="Primary navigation"
>
	<a href="/" class="flex items-center gap-2.5 px-5 py-5">
		<Logo class="size-7" />
		<div class="leading-none">
			<p class="text-[14px] font-semibold tracking-[-0.01em]">FisionTV+</p>
			<p
				class="mt-0.5 text-[10.5px] font-medium tracking-[0.18em] text-muted uppercase"
			>
				Certifier · Admin
			</p>
		</div>
	</a>

	<nav class="flex-1 space-y-0.5 px-3 py-2">
		{#each links as link (link.href)}
			{@const active = isActive(link.href, page.url.pathname)}
			<a
				href={link.href}
				class="group flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] transition-colors {active
					? 'bg-pink-500/10 text-foreground'
					: 'text-muted hover:bg-white/[0.03] hover:text-foreground'}"
			>
				<link.icon
					class="size-4 shrink-0 {active ? 'text-pink-500' : ''}"
					strokeWidth={1.75}
				/>
				<span class="font-medium">{link.label}</span>
				{#if active}
					<span
						class="ml-auto size-1.5 rounded-full bg-pink-500"
						style="box-shadow: 0 0 6px rgba(238,61,91,0.7);"
					></span>
				{/if}
			</a>
		{/each}
	</nav>

	<div class="border-t border-border px-5 py-4">
		<p class="text-[10.5px] font-medium tracking-[0.16em] text-muted uppercase">
			Build
		</p>
		<p class="mt-1.5 font-mono text-xs text-muted">backend · v0.2.0</p>
	</div>
</aside>

import { formatDistanceToNow } from 'date-fns';

export function formatMbps(value: number | undefined | null): string {
	if (value == null) return '—';
	return `${value.toFixed(1)} Mbps`;
}

export function formatMs(value: number | undefined | null): string {
	if (value == null) return '—';
	return `${value} ms`;
}

export function formatRelative(iso: string): string {
	return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function formatAbsolute(iso: string): string {
	return new Date(iso).toLocaleString(undefined, {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});
}

export function shortId(id: string): string {
	return id.slice(0, 8);
}

export function tierLabel(tier: string): string {
	switch (tier) {
		case 'uhd_hdr':
			return '4K HDR';
		case 'uhd':
			return '4K';
		case 'hd':
			return 'HD';
		case 'sd':
			return 'SD';
		case 'none':
			return 'None';
		default:
			return tier;
	}
}

export function tierColor(tier: string): string {
	switch (tier) {
		case 'uhd_hdr':
			return 'var(--color-fision-pink)';
		case 'uhd':
			return 'var(--color-fision-pink-dark)';
		case 'hd':
			return 'var(--color-cyan-accent)';
		case 'sd':
			return 'var(--color-muted)';
		case 'none':
			return '#f43f5e';
		default:
			return 'var(--color-muted)';
	}
}

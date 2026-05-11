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

const ABSOLUTE_OPTS: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'short',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit'
};

/**
 * Render a timestamp deterministically. SSR uses UTC so server and client
 * agree at hydration; the <LocalTime> component swaps in the browser's
 * local TZ after mount. Pass `timeZone` to force a specific zone.
 */
export function formatAbsolute(iso: string, timeZone: string = 'UTC'): string {
	const d = new Date(iso);
	const formatted = new Intl.DateTimeFormat(undefined, {
		...ABSOLUTE_OPTS,
		timeZone
	}).format(d);
	const abbr = tzAbbr(d, timeZone);
	return abbr ? `${formatted} ${abbr}` : formatted;
}

/** Short TZ abbreviation (e.g. "UTC", "CDT") for the given instant and zone. */
export function tzAbbr(date: Date, timeZone: string): string {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone,
		timeZoneName: 'short'
	}).formatToParts(date);
	return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
}

/** Resolve the IANA name of the browser's local TZ (e.g. "America/Chicago"). */
export function localTimeZone(): string {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
	} catch {
		return 'UTC';
	}
}

export function shortId(id: string): string {
	return id.slice(0, 8);
}

// Threshold at which a queue-delayed cert is worth surfacing to the
// operator. Matches the backend's queuedOnly SQL filter (>5 min).
export const QUEUED_BADGE_THRESHOLD_S = 300;

/**
 * Humanizes a queue-delay duration. Picks the largest meaningful unit:
 * "3d", "5h", "12m", "47s". Returns "—" for null/undefined; "0s" for
 * sub-second values.
 */
export function humanizeDelay(seconds: number | null | undefined): string {
	if (seconds == null) return '—';
	if (seconds < 1) return '0s';
	if (seconds < 60) return `${Math.round(seconds)}s`;
	if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
	if (seconds < 86_400) return `${Math.round(seconds / 3600)}h`;
	return `${Math.round(seconds / 86_400)}d`;
}

/** Format a byte count as the largest readable unit (B/KB/MB/GB). */
export function formatBytes(bytes: number | null | undefined): string {
	if (bytes == null) return '—';
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
	return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
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

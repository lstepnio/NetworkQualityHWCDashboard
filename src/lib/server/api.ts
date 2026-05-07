import { env } from '$env/dynamic/private';
import type {
	CertDetail,
	CertFilters,
	CertList,
	ConfigList,
	ConfigSummary
} from '$lib/types';

function backendURL(): string {
	return env.NETWORKQUALITY_BACKEND_URL ?? 'http://localhost:8080';
}

function adminToken(): string {
	const t = env.NETWORKQUALITY_ADMIN_TOKEN ?? '';
	if (!t) {
		throw new Error('NETWORKQUALITY_ADMIN_TOKEN is not set');
	}
	return t;
}

async function adminFetch<T>(path: string): Promise<T> {
	const res = await fetch(`${backendURL()}${path}`, {
		headers: { Authorization: `Bearer ${adminToken()}` },
		cache: 'no-store'
	});
	if (!res.ok) {
		const body = await res.text().catch(() => '');
		throw new Error(`${res.status} ${res.statusText} from ${path}: ${body}`);
	}
	return (await res.json()) as T;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
	const parts: string[] = [];
	for (const [k, v] of Object.entries(params)) {
		if (v === undefined || v === null || v === '') continue;
		parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
	}
	return parts.length === 0 ? '' : `?${parts.join('&')}`;
}

export function listCerts(filters: CertFilters = {}): Promise<CertList> {
	return adminFetch<CertList>(
		`/admin/certifications${buildQuery({
			tier: filters.tier,
			deviceId: filters.deviceId,
			configVersion: filters.configVersion,
			from: filters.from,
			to: filters.to,
			limit: filters.limit,
			offset: filters.offset
		})}`
	);
}

export function getCert(id: string): Promise<CertDetail> {
	return adminFetch<CertDetail>(`/admin/certifications/${encodeURIComponent(id)}`);
}

export function listConfigs(includeDocument = false): Promise<ConfigList> {
	return adminFetch<ConfigList>(
		`/admin/cert-configs${buildQuery({
			includeDocument: includeDocument ? 'true' : undefined
		})}`
	);
}

export function getConfig(version: string): Promise<ConfigSummary> {
	return adminFetch<ConfigSummary>(`/admin/cert-configs/${encodeURIComponent(version)}`);
}

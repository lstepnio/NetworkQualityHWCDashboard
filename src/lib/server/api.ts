import { env } from '$env/dynamic/private';
import type {
	AppVersionList,
	AppVersionSummary,
	CertDetail,
	CertFilters,
	CertList,
	ConfigList,
	ConfigSummary,
	QueueStats
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
			hsn: filters.hsn,
			publicIp: filters.publicIp,
			queuedOnly: filters.queuedOnly ? 'true' : undefined,
			from: filters.from,
			to: filters.to,
			sort: filters.sort,
			dir: filters.dir,
			limit: filters.limit,
			offset: filters.offset
		})}`
	);
}

export function getQueueStats(windowHours = 24): Promise<QueueStats> {
	return adminFetch<QueueStats>(`/admin/queue-stats?windowHours=${windowHours}`);
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

async function adminWrite<T>(path: string, body: unknown): Promise<T> {
	const res = await fetch(`${backendURL()}${path}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${adminToken()}`,
			'Content-Type': 'application/json'
		},
		body: body == null ? undefined : JSON.stringify(body),
		cache: 'no-store'
	});
	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new BackendError(res.status, text || res.statusText);
	}
	return (await res.json()) as T;
}

export class BackendError extends Error {
	status: number;
	body: string;
	constructor(status: number, body: string) {
		super(`${status}: ${body}`);
		this.status = status;
		this.body = body;
	}
}

export function createConfig(document: Record<string, unknown>): Promise<ConfigSummary> {
	return adminWrite<ConfigSummary>('/admin/cert-configs', document);
}

export function activateConfig(version: string): Promise<ConfigSummary> {
	return adminWrite<ConfigSummary>(
		`/admin/cert-configs/${encodeURIComponent(version)}/activate`,
		null
	);
}

export function listAppVersions(includeDocument = false): Promise<AppVersionList> {
	return adminFetch<AppVersionList>(
		`/admin/app-versions${buildQuery({ includeDocument: includeDocument ? 'true' : undefined })}`
	);
}

export function getAppVersion(versionCode: number): Promise<AppVersionSummary> {
	return adminFetch<AppVersionSummary>(`/admin/app-versions/${versionCode}`);
}

export function createAppVersion(document: Record<string, unknown>): Promise<AppVersionSummary> {
	return adminWrite<AppVersionSummary>('/admin/app-versions', document);
}

export function activateAppVersion(versionCode: number): Promise<AppVersionSummary> {
	return adminWrite<AppVersionSummary>(`/admin/app-versions/${versionCode}/activate`, null);
}

// Mirrors the JSON shapes returned by the backend's /admin/* endpoints
// (NetworkQualityHWCBackend internal/api/admin.go). No contract repo —
// these evolve in lock-step with the backend; PRs touch both.

export type CertSummary = {
	certificationId: string;
	deviceId: string;
	hsn?: string;
	configVersion?: string;
	startedAt: string;
	completedAt: string;
	achievedTier: string;
	marginalMetric?: string;
	transport: string;
	widevineLevel?: string;
	hdrTypes: string[];
	displayMaxHeight?: number;
	thermalStatus?: string;
	downloadSteadyMbps?: number;
	uploadSteadyMbps?: number;
	latencyMedianMs?: number;
	// WiFi health bucket the Android client computes (STRONG / GOOD /
	// MARGINAL / WEAK). Extracted backend-side from payload.result.wifiLink.
	// Null on Ethernet or older clients.
	wifiRating?: string;
	wifiRssiDbm?: number;
	publicIpHash?: string; // never the raw IP; backend hashes search inputs
	enqueuedAt?: string;
	submittedAt?: string;
	// submittedAt - completedAt in seconds, clamped >= 0. Omitted by the
	// backend when submittedAt is null (older-client payload pre-v1.1.0).
	queueDelaySeconds?: number;
	receivedAt: string;
};

export type CertList = {
	items: CertSummary[];
	total: number;
	limit: number;
	offset: number;
};

export type CertDetail = {
	summary: CertSummary;
	payloadHash: string;
	payload: Record<string, unknown>;
};

export type ConfigSummary = {
	configVersion: string;
	schemaVersion: number;
	isActive: boolean;
	createdAt: string;
	document?: Record<string, unknown>;
};

export type ConfigList = {
	items: ConfigSummary[];
	total: number;
};

export type CertFilters = {
	tier?: string;
	deviceId?: string;
	configVersion?: string;
	hsn?: string;
	publicIp?: string;
	queuedOnly?: boolean;
	from?: string;
	to?: string;
	// Whitelisted backend keys: completed | received | tier | download |
	// upload | latency | wifi | device | config | hsn. Unknown keys are
	// silently ignored by the backend (falls back to completed_at).
	sort?: string;
	dir?: 'asc' | 'desc';
	limit?: number;
	offset?: number;
};

export type QueueStats = {
	windowHours: number;
	sampleSize: number;
	medianSeconds: number | null;
	p95Seconds: number | null;
	maxSeconds: number | null;
};

export type AppVersionSummary = {
	latestVersionCode: number;
	latestVersionName: string;
	minRequiredVersionCode: number;
	publishedAt?: string;
	isActive: boolean;
	createdAt: string;
	document?: Record<string, unknown>;
};

export type AppVersionList = {
	items: AppVersionSummary[];
	total: number;
};

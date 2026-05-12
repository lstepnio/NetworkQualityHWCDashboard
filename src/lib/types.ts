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
	// DNS-policy verdict (contract v2.3.0). true = all actuals matched
	// preferred set (or vacuous empty); false = at least one non-preferred
	// actual server; omitted when no dnsPolicy was active at ingest or the
	// payload predates v2.3.0.
	dnsPreferred?: boolean;
	publicIp?: string; // plaintext for new rows; legacy rows (ingested before backend v0.7.11) still carry the SHA-256 string
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

// Per-cert DNS-policy verdict (contract v2.3.0). Lives in
// payload.result.dnsAssessment. Omitted on pre-v2.3.0 client payloads or
// when the active config had no dnsPolicy block.
export type DnsAssessment = {
	configuredPreferred: string[];
	nonPreferred: string[];
	allPreferred: boolean;
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
	// Per-device targeting selectors (contract v2.2.0). All three optional.
	// When all are absent the row is the "default" catch-all. The backend
	// resolves "most specific match wins": fingerprint > model > manufacturer
	// > default. Existing rows created against pre-2.2.0 backends omit these.
	targetManufacturer?: string | null;
	targetModel?: string | null;
	targetBuildFingerprint?: string | null;
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
	dnsFlagged?: boolean;
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

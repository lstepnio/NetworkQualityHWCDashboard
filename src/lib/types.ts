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
	publicIpHash?: string; // never the raw IP; backend hashes search inputs. STB-reported via STUN.
	requestIpHash?: string; // backend-observed source IP of the POST request, same hash family as publicIpHash
	ispAsn?: number; // Cymru lookup of the request-source IP at ingest
	ispName?: string; // Cymru's registered name for the AS (e.g. "HOTWIRE-COMMUNICATIONS, US")
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

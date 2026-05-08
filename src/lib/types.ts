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
	publicIpHash?: string; // never the raw IP; backend hashes search inputs
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
	from?: string;
	to?: string;
	limit?: number;
	offset?: number;
};

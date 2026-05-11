import { getQueueStats, listCerts, listConfigs } from '$lib/server/api';

export const load = async () => {
	const [certs, configs, queueStats] = await Promise.all([
		listCerts({ limit: 200 }),
		listConfigs(),
		// Best-effort: an older backend without /admin/queue-stats just
		// drops this widget rather than failing the whole page.
		getQueueStats(24).catch(() => null)
	]);
	return { certs, configs, queueStats };
};

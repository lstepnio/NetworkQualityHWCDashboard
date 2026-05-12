import { listCerts } from '$lib/server/api';
import type { ServerLoadEvent } from '@sveltejs/kit';

const PAGE_SIZE = 50;

export const load = async ({ url }: ServerLoadEvent) => {
	const tier = url.searchParams.get('tier') ?? undefined;
	const deviceId = url.searchParams.get('deviceId') ?? undefined;
	const configVersion = url.searchParams.get('configVersion') ?? undefined;
	const hsn = url.searchParams.get('hsn') ?? undefined;
	const publicIp = url.searchParams.get('publicIp') ?? undefined;
	const queuedOnly = url.searchParams.get('queuedOnly') === 'true';
	const sort = url.searchParams.get('sort') ?? undefined;
	const dirRaw = url.searchParams.get('dir');
	const dir = dirRaw === 'asc' || dirRaw === 'desc' ? dirRaw : undefined;
	const limit = Number(url.searchParams.get('limit') ?? PAGE_SIZE);
	const offset = Number(url.searchParams.get('offset') ?? 0);

	const certs = await listCerts({
		tier,
		deviceId,
		configVersion,
		hsn,
		publicIp,
		queuedOnly,
		sort,
		dir,
		limit,
		offset
	});
	return {
		certs,
		filters: { tier, deviceId, configVersion, hsn, publicIp, queuedOnly },
		sort,
		dir,
		limit,
		offset
	};
};

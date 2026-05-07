import { listCerts } from '$lib/server/api';
import type { ServerLoadEvent } from '@sveltejs/kit';

const PAGE_SIZE = 50;

export const load = async ({ url }: ServerLoadEvent) => {
	const tier = url.searchParams.get('tier') ?? undefined;
	const deviceId = url.searchParams.get('deviceId') ?? undefined;
	const configVersion = url.searchParams.get('configVersion') ?? undefined;
	const limit = Number(url.searchParams.get('limit') ?? PAGE_SIZE);
	const offset = Number(url.searchParams.get('offset') ?? 0);

	const certs = await listCerts({ tier, deviceId, configVersion, limit, offset });
	return { certs, filters: { tier, deviceId, configVersion }, limit, offset };
};

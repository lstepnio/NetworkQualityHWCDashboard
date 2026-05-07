import { error } from '@sveltejs/kit';
import { listCerts } from '$lib/server/api';
import type { ServerLoadEvent } from '@sveltejs/kit';

export const load = async ({ params }: ServerLoadEvent) => {
	const deviceId = params.deviceId ?? '';
	const certs = await listCerts({ deviceId, limit: 200 });
	if (certs.total === 0) {
		error(404, 'No certifications for this device');
	}
	return { certs, deviceId };
};

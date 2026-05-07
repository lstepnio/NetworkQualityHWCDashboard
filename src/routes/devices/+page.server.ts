import { listCerts } from '$lib/server/api';

export const load = async () => {
	const certs = await listCerts({ limit: 200 });
	return { certs };
};

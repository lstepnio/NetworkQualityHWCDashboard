import { listCerts, listConfigs } from '$lib/server/api';

export const load = async () => {
	const [certs, configs] = await Promise.all([listCerts({ limit: 200 }), listConfigs()]);
	return { certs, configs };
};

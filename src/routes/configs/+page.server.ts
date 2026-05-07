import { listConfigs } from '$lib/server/api';

export const load = async () => {
	const configs = await listConfigs();
	return { configs };
};

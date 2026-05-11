import { listAppVersions } from '$lib/server/api';

export const load = async () => {
	const versions = await listAppVersions();
	return { versions };
};

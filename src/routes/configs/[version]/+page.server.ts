import { error } from '@sveltejs/kit';
import { getConfig } from '$lib/server/api';
import type { ServerLoadEvent } from '@sveltejs/kit';

export const load = async ({ params }: ServerLoadEvent) => {
	try {
		const config = await getConfig(params.version ?? '');
		return { config };
	} catch (e) {
		if (e instanceof Error && e.message.includes('404')) {
			error(404, 'Config not found');
		}
		throw e;
	}
};

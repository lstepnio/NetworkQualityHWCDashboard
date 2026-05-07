import { error } from '@sveltejs/kit';
import { getCert } from '$lib/server/api';
import type { ServerLoadEvent } from '@sveltejs/kit';

export const load = async ({ params }: ServerLoadEvent) => {
	try {
		const detail = await getCert(params.id ?? '');
		return { detail };
	} catch (e) {
		if (e instanceof Error && e.message.includes('404')) {
			error(404, 'Certification not found');
		}
		throw e;
	}
};

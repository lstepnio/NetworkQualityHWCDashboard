import { error, fail } from '@sveltejs/kit';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { activateConfig, BackendError, getConfig, listConfigs } from '$lib/server/api';

export const load: ServerLoad = async ({ params }) => {
	try {
		const config = await getConfig(params.version ?? '');
		const all = await listConfigs();
		const activeVersion = all.items.find((c) => c.isActive)?.configVersion ?? null;
		return { config, activeVersion };
	} catch (e) {
		if (e instanceof Error && e.message.includes('404')) {
			error(404, 'Config not found');
		}
		throw e;
	}
};

export const actions: Actions = {
	activate: async ({ params }) => {
		try {
			await activateConfig(params.version ?? '');
			return { success: true };
		} catch (e) {
			if (e instanceof BackendError) {
				return fail(e.status, { error: e.body });
			}
			throw e;
		}
	}
};

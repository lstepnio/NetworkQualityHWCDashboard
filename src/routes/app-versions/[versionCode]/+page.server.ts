import { error, fail } from '@sveltejs/kit';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { activateAppVersion, BackendError, getAppVersion, listAppVersions } from '$lib/server/api';

export const load: ServerLoad = async ({ params }) => {
	const code = Number(params.versionCode ?? '0');
	if (!Number.isInteger(code) || code < 1) {
		error(400, 'versionCode must be a positive integer');
	}
	try {
		const version = await getAppVersion(code);
		const all = await listAppVersions();
		const activeCode =
			all.items.find((v: { isActive: boolean }) => v.isActive)?.latestVersionCode ?? null;
		return { version, activeCode };
	} catch (e) {
		if (e instanceof Error && e.message.includes('404')) {
			error(404, 'Manifest not found');
		}
		throw e;
	}
};

export const actions: Actions = {
	activate: async ({ params }) => {
		const code = Number(params.versionCode ?? '0');
		try {
			await activateAppVersion(code);
			return { success: true };
		} catch (e) {
			if (e instanceof BackendError) {
				return fail(e.status, { error: e.body });
			}
			throw e;
		}
	}
};

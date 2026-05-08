import { fail, redirect } from '@sveltejs/kit';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { BackendError, createConfig, getConfig, listConfigs } from '$lib/server/api';

export const load: ServerLoad = async ({ url }) => {
	const fromVersion = url.searchParams.get('from');
	const configs = await listConfigs();

	let template: Record<string, unknown> | null = null;
	let templateVersion: string | null = null;

	if (fromVersion) {
		const c = await getConfig(fromVersion);
		template = c.document ?? null;
		templateVersion = c.configVersion;
	} else {
		const active = configs.items.find((c) => c.isActive);
		if (active) {
			const c = await getConfig(active.configVersion);
			template = c.document ?? null;
			templateVersion = c.configVersion;
		}
	}

	return { template, templateVersion, configs };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const documentRaw = String(form.get('document') ?? '');

		let document: Record<string, unknown>;
		try {
			document = JSON.parse(documentRaw);
		} catch (e) {
			return fail(400, {
				error: 'invalid JSON: ' + (e instanceof Error ? e.message : String(e)),
				document: documentRaw
			});
		}

		try {
			const created = await createConfig(document);
			redirect(303, `/configs/${encodeURIComponent(created.configVersion)}`);
		} catch (e) {
			if (e instanceof BackendError) {
				return fail(e.status === 409 ? 409 : 400, { error: e.body, document: documentRaw });
			}
			throw e;
		}
	}
};

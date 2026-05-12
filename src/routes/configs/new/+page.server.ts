import { fail, redirect } from '@sveltejs/kit';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { BackendError, createConfig, getConfig, listConfigs } from '$lib/server/api';

export const load: ServerLoad = async ({ url }) => {
	const fromVersion = url.searchParams.get('from');
	const configs = await listConfigs();

	let template: Record<string, unknown> | null = null;
	let templateVersion: string | null = null;
	// Pre-fill the targeting inputs when cloning from an existing row so
	// operators tweak rather than re-type. The list endpoint doesn't include
	// the document but does include the targeting selectors; that's enough.
	let templateTargeting: {
		targetManufacturer: string | null;
		targetModel: string | null;
		targetBuildFingerprint: string | null;
	} | null = null;

	if (fromVersion) {
		const c = await getConfig(fromVersion);
		template = c.document ?? null;
		templateVersion = c.configVersion;
		templateTargeting = {
			targetManufacturer: c.targetManufacturer ?? null,
			targetModel: c.targetModel ?? null,
			targetBuildFingerprint: c.targetBuildFingerprint ?? null
		};
	} else {
		const active = configs.items.find((c) => c.isActive);
		if (active) {
			const c = await getConfig(active.configVersion);
			template = c.document ?? null;
			templateVersion = c.configVersion;
			// Don't seed targeting from the active row — a new draft should default
			// to "default" unless the operator clones explicitly via ?from=.
		}
	}

	return { template, templateVersion, templateTargeting, configs };
};

// Normalize a form field to a trimmed string or null. The backend treats
// missing, null, and "" the same on POST (stringPtrFromDoc), but sending
// null when the operator left the box blank is cleaner on the wire.
function nullableString(v: FormDataEntryValue | null): string | null {
	if (v == null) return null;
	const s = String(v).trim();
	return s === '' ? null : s;
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const documentRaw = String(form.get('document') ?? '');
		const targetManufacturer = nullableString(form.get('targetManufacturer'));
		const targetModel = nullableString(form.get('targetModel'));
		const targetBuildFingerprint = nullableString(form.get('targetBuildFingerprint'));

		let document: Record<string, unknown>;
		try {
			document = JSON.parse(documentRaw);
		} catch (e) {
			return fail(400, {
				error: 'invalid JSON: ' + (e instanceof Error ? e.message : String(e)),
				document: documentRaw,
				targetManufacturer: targetManufacturer ?? '',
				targetModel: targetModel ?? '',
				targetBuildFingerprint: targetBuildFingerprint ?? ''
			});
		}

		// Layer the targeting selectors into the request body. Send explicit
		// nulls when blank so the backend stores NULL rather than "". The
		// backend's stringPtrFromDoc treats both the same, but null is cleaner.
		const body: Record<string, unknown> = {
			...document,
			targetManufacturer,
			targetModel,
			targetBuildFingerprint
		};

		try {
			const created = await createConfig(body);
			redirect(303, `/configs/${encodeURIComponent(created.configVersion)}`);
		} catch (e) {
			if (e instanceof BackendError) {
				return fail(e.status === 409 ? 409 : 400, {
					error: e.body,
					document: documentRaw,
					targetManufacturer: targetManufacturer ?? '',
					targetModel: targetModel ?? '',
					targetBuildFingerprint: targetBuildFingerprint ?? ''
				});
			}
			throw e;
		}
	}
};

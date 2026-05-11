import { fail, redirect } from '@sveltejs/kit';
import type { Actions, ServerLoad } from '@sveltejs/kit';
import { BackendError, createAppVersion, listAppVersions } from '$lib/server/api';

export const load: ServerLoad = async () => {
	const versions = await listAppVersions();
	const latest = versions.items[0]; // sorted desc by latestVersionCode
	return { versions, latest };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();

		// Helper: read a string field; empty → undefined.
		const s = (k: string) => {
			const v = form.get(k);
			return v == null ? undefined : String(v).trim() || undefined;
		};

		const doc: Record<string, unknown> = {
			schemaVersion: 1,
			latestVersionName: s('latestVersionName'),
			latestVersionCode: Number(s('latestVersionCode') ?? '0'),
			minRequiredVersionCode: Number(s('minRequiredVersionCode') ?? '0'),
			apkUrl: s('apkUrl'),
			apkSizeBytes: Number(s('apkSizeBytes') ?? '0'),
			apkSha256: (s('apkSha256') ?? '').toLowerCase(),
			signingCertSha256: (s('signingCertSha256') ?? '').toLowerCase(),
			releaseNotes: s('releaseNotes') ?? null,
			publishedAt: s('publishedAt')
				? new Date(s('publishedAt') as string).toISOString()
				: undefined
		};

		// Strip undefined keys so the backend's validator doesn't see them
		// as "field present, value invalid" and over-report.
		for (const k of Object.keys(doc)) {
			if (doc[k] === undefined) delete doc[k];
		}

		try {
			const created = await createAppVersion(doc);
			redirect(303, `/app-versions/${created.latestVersionCode}`);
		} catch (e) {
			if (e instanceof BackendError) {
				return fail(e.status === 409 ? 409 : 400, {
					error: e.body,
					values: Object.fromEntries(form)
				});
			}
			throw e;
		}
	}
};

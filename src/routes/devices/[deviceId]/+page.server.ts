import { error } from '@sveltejs/kit';
import { listCerts } from '$lib/server/api';
import type { ServerLoadEvent } from '@sveltejs/kit';

// UUID v4-ish — what the Android app generates and stamps as deviceId.
// Anything else we treat as an HSN (typical lab HSN is "E44AW…", legacy
// rows have a 64-char SHA-256 hash). HSN is the operationally meaningful
// identity (one physical STB) and can span multiple deviceIds across
// app reinstalls. The deviceId branch stays for legacy null-HSN rows
// that can't be joined by HSN.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const load = async ({ params }: ServerLoadEvent) => {
	const id = params.deviceId ?? '';
	const keyedBy: 'deviceId' | 'hsn' = UUID_RE.test(id) ? 'deviceId' : 'hsn';
	const filter = keyedBy === 'deviceId' ? { deviceId: id } : { hsn: id };
	const certs = await listCerts({ ...filter, limit: 200 });
	if (certs.total === 0) {
		error(404, 'No certifications for this device');
	}
	return { certs, identity: id, keyedBy };
};

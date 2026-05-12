import { env } from '$env/dynamic/private';
import { error, type Handle } from '@sveltejs/kit';

/**
 * HTTP Basic Auth gate for the entire dashboard.
 *
 * Why: the dashboard's server-side fetches use the backend admin token, so
 * the surface is "anyone with network access to the dashboard URL becomes a
 * dashboard admin." A single shared password is the minimum gate before
 * anything beyond the dev Mac sees this UI. Replace with SSO/OIDC when the
 * deployment story warrants it.
 *
 * Config:
 *   NETWORKQUALITY_DASHBOARD_USER     — Basic-auth username  (default: "admin")
 *   NETWORKQUALITY_DASHBOARD_PASSWORD — Basic-auth password  (required; no default)
 *
 * If the password is unset the dashboard refuses every request with 500 —
 * fail-closed is intentional. Set the env var (or copy .env.example to .env)
 * to bring it up.
 */
const REALM = 'FisionTV+ Certifier Admin';

function timingSafeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

export const handle: Handle = async ({ event, resolve }) => {
	const expectedPassword = env.NETWORKQUALITY_DASHBOARD_PASSWORD ?? '';
	if (!expectedPassword) {
		// Fail-closed. Don't accidentally ship a no-auth dashboard.
		throw error(
			500,
			'NETWORKQUALITY_DASHBOARD_PASSWORD is not set — dashboard refuses to serve unauthenticated requests'
		);
	}
	const expectedUser = env.NETWORKQUALITY_DASHBOARD_USER ?? 'admin';

	const auth = event.request.headers.get('authorization') ?? '';
	if (auth.startsWith('Basic ')) {
		// Basic <base64(user:pass)>
		let decoded = '';
		try {
			decoded = atob(auth.slice('Basic '.length).trim());
		} catch {
			// fall through to challenge below
		}
		const idx = decoded.indexOf(':');
		if (idx >= 0) {
			const user = decoded.slice(0, idx);
			const pass = decoded.slice(idx + 1);
			if (timingSafeEqual(user, expectedUser) && timingSafeEqual(pass, expectedPassword)) {
				return resolve(event);
			}
		}
	}

	return new Response('Authentication required', {
		status: 401,
		headers: {
			'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
			'Content-Type': 'text/plain'
		}
	});
};

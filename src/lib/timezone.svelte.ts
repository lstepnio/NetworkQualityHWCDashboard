import { browser } from '$app/environment';

const STORAGE_KEY = 'fision.useUtc';

function readInitial(): boolean {
	if (!browser) return false;
	try {
		return localStorage.getItem(STORAGE_KEY) === 'true';
	} catch {
		return false;
	}
}

class TimezonePref {
	useUtc = $state(false);

	constructor() {
		if (browser) {
			this.useUtc = readInitial();
		}
	}

	toggle() {
		this.useUtc = !this.useUtc;
		if (browser) {
			try {
				localStorage.setItem(STORAGE_KEY, String(this.useUtc));
			} catch {
				// localStorage unavailable (private mode, quota) — toggle still
				// applies for the current session; just doesn't persist across reloads.
			}
		}
	}
}

export const tz = new TimezonePref();

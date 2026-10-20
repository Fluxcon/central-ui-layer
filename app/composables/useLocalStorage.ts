import type { Ref } from 'vue';

export function useLocalStorage<T>(key: string, init: () => T): Ref<T> {
	const state = useState<T>(key, init);

	if (import.meta.client) {
		// Ported from v3, with the read moved into onMounted. v3 read during
		// setup, which it could get away with because Clerk gated the whole app
		// into SPA mode — nothing was ever server-rendered. Here the server
		// renders the initial value and the client would render the stored one,
		// so a setup-time read is a hydration mismatch on every consumer.
		onMounted(() => {
			const stored = localStorage.getItem(key);
			if (stored !== null) {
				try {
					state.value = JSON.parse(stored);
				} catch {
					// Keep the initialized value if parsing fails
				}
			}
		});

		watch(
			state,
			(newValue) => {
				if (newValue === null || newValue === undefined) {
					localStorage.removeItem(key);
				} else {
					localStorage.setItem(key, JSON.stringify(newValue));
				}
			},
			{ deep: true },
		);
	}

	return state;
}

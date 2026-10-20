/**
 * A read-only copy of `source` that only catches up once `source` has been
 * still for `ms` — what every search box hangs its fetch (or filter) off, so a
 * request does not fire per keystroke. Watch or query on the returned ref, not
 * on `source`.
 *
 * Local rather than VueUse's `refDebounced`: `@vueuse/core` is only here as a
 * Nuxt UI transitive dependency, and pnpm will not let the app import it.
 */
export function useDebounced<T>(source: Ref<T>, ms = 300): Readonly<Ref<T>> {
	const debounced = ref(source.value) as Ref<T>;
	let timer: ReturnType<typeof setTimeout> | undefined;
	watch(source, (value) => {
		clearTimeout(timer);
		timer = setTimeout(() => (debounced.value = value), ms);
	});
	onScopeDispose(() => clearTimeout(timer));
	return readonly(debounced) as Readonly<Ref<T>>;
}

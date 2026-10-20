/**
 * The reason a route refused, for a toast.
 *
 * Every server route here throws `createError({ statusCode, message })`. h3
 * puts that text in the body's **`message`** and leaves `statusMessage` as the
 * literal string `"Server Error"` — so the `.data.statusMessage` that 17 call
 * sites reached for first showed the user "Server Error" instead of "A tag
 * named 'iridium' already exists (1)". `message` first, always.
 */
export function apiErrorMessage(e: unknown, fallback = 'Something went wrong.') {
	const data = (e as { data?: { message?: string; statusMessage?: string } })?.data;
	const status = data?.statusMessage;
	return data?.message
		?? (status && status !== 'Server Error' ? status : undefined)
		?? (e as Error)?.message
		?? fallback;
}

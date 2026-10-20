const toastIcons = {
	error: 'carbon:warning-square',
	success: 'carbon:checkmark-outline',
	primary: 'carbon:checkmark-filled',
	secondary: 'carbon:thumbs-up',
	tertiary: 'carbon:thumbs-down',
	highlight: 'carbon:idea',
	info: 'carbon:information-square',
	warning: 'carbon:warning-alt',
	neutral: 'carbon:help',
} as const;

export type ToastColor = keyof typeof toastIcons;

type ToastOptions = Parameters<ReturnType<typeof useToast>['add']>[0];

export function useAppToast() {
	const toast = useToast();

	const add = (options: Omit<ToastOptions, 'color'> & { color?: ToastColor }) => {
		const color = options.color ?? 'primary';
		const icon = options.icon ?? toastIcons[color] ?? toastIcons.primary;

		return toast.add({
			...options,
			color,
			icon,
		});
	};

	return {
		...toast,
		add,
	};
}

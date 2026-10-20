<script setup lang="ts">
	import type { DropdownMenuItem } from '@nuxt/ui';

	/**
	 * Colour-mode toggle plus the signed-in user's menu. Auth-agnostic: the app
	 * passes the user and handles `logout` (and `profile`, if it shows that item).
	 */
	const props = defineProps<{
		name?: string;
		email?: string;
		image?: string | null;
		/** Show the "My profile" item; emits `profile` when picked. */
		profile?: boolean;
	}>();
	const emit = defineEmits<{ logout: []; profile: [] }>();

	const items = computed<DropdownMenuItem[][]>(() => [
		[
			{
				label: props.name ?? 'n/a',
				description: props.email,
				avatar: {
					src: props.image ?? undefined,
					loading: 'lazy',
					icon: 'carbon:user-avatar-filled',
					size: 'xl',
				},
				type: 'label',
			},
		],
		[
			...(props.profile
				? [{ label: 'My profile', icon: 'carbon:user-profile', onSelect: () => emit('profile') }]
				: []),
			{ label: 'Logout', icon: 'carbon:logout', color: 'error' as const, onSelect: () => emit('logout') },
		],
	]);
</script>

<template>
	<div class="flex items-center gap-2">
		<UColorModeButton variant="ghost" square />
		<UDropdownMenu
			arrow
			:items="items"
			:content="{
				align: 'end',
				side: 'bottom',
				sideOffset: 8,
			}"
		>
			<UButton
				icon="carbon:user-avatar"
				trailing-icon="carbon:chevron-down"
				color="neutral"
				variant="ghost"
				:ui="{ trailingIcon: 'size-4' }"
			/>
		</UDropdownMenu>
	</div>
</template>

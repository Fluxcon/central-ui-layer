<template>
	<PagePanel id="activation" :title="`Activation #${id}`" :breadcrumbs="crumbs">
		<template #right>
			<UserCard name="Jane Doe" email="jane@example.com" />
		</template>

		<template #actions>
			<UButton icon="carbon:edit" label="Edit" color="info" />
		</template>

		<p>Two levels deep, so the navbar shows a back button to the parent crumb.</p>
	</PagePanel>
</template>

<script setup lang="ts">
	const id = useRoute().params.id as string;

	const crumbs = [
		{ label: 'Home', icon: 'carbon:workspace', to: '/' },
		{ label: `#${id}`, icon: 'carbon:satellite' },
	];
</script>

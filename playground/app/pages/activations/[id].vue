<template>
	<PagePanel id="activation" :title="`Activation #${id}`" :breadcrumbs="crumbs" :back="route.query.back !== '0'">
		<template #right>
			<UserCard name="Jane Doe" email="jane@example.com" />
		</template>

		<template #actions>
			<UButton icon="carbon:edit" label="Edit" color="info" />
		</template>

		<template #breadcrumbs-after>
			<UBadge label="Pending" color="neutral" variant="subtle" />
		</template>

		<p>Two levels deep, so the navbar shows a back button to the parent crumb. <code>?back=0</code> hides it with <code>:back="false"</code>. The badge sits after the breadcrumbs.</p>
	</PagePanel>
</template>

<script setup lang="ts">
	const route = useRoute();
	const id = route.params.id as string;

	const crumbs = [
		{ label: 'Home', icon: 'carbon:workspace', to: '/' },
		{ label: `#${id}`, icon: 'carbon:satellite' },
	];
</script>

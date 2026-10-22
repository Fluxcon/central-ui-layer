<script setup lang="ts">
	// v4's login card on LoginBackdrop; `?color=blue` shows SBDA's. BrandLogo keeps v4's class, which is a
	// shrink-to-fit flex row: the check that the wordmark's width fallback holds.
	definePageMeta({ layout: false });

	const route = useRoute();
	const email = ref('');
</script>

<template>
	<LoginBackdrop :color="route.query.color === 'blue' ? 'blue' : 'orange'">
		<UCard variant="soft" :ui="{ root: ' w-full max-w-sm shadow-xl', body: 'flex flex-col gap-4' }">
			<BrandLogo class="flex justify-center zoom-110" />
			<UFormField label="Email" size="xl">
				<UInput v-model="email" type="email" icon="carbon:email" variant="soft" :ui="{ root: 'w-full' }" />
			</UFormField>
			<UButton block icon="carbon:login" label="Sign in" size="xl" to="/" />
		</UCard>
	</LoginBackdrop>
</template>

<template>
	<UApp :toaster="{ position: 'top-center' }">
		<NuxtLoadingIndicator :color="false" class="bg-linear-to-r/oklch from-primary to-secondary" />
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</UApp>
</template>

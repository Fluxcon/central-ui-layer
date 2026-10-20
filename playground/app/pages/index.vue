<template>
	<UDashboardPanel>
		<template #header>
			<UDashboardNavbar title="Home">
				<template #right>
					<UserCard name="Jane Doe" email="jane@example.com" />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="flex flex-wrap gap-2">
				<UButton color="primary">Primary</UButton>
				<UButton color="secondary">Secondary</UButton>
				<UButton color="success">Success</UButton>
				<UButton color="error">Error</UButton>
				<UButton @click="useAppToast().add({ title: 'Saved', color: 'success' })">Save</UButton>
			</div>
		</template>
	</UDashboardPanel>
</template>

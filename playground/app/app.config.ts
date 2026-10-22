export default defineAppConfig({
	ui: { colors: { primary: 'orange' } },
	app: {
		name: 'Playground',
		company: 'Fluxcon',
		nav: [
			{ label: 'Home', icon: 'carbon:workspace', to: '/' },
		],
	},
});

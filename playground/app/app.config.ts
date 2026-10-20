export default defineAppConfig({
	ui: { colors: { primary: 'orange' } },
	app: {
		name: 'Playground',
		company: 'Fluxcon',
		nav: [
			{ label: 'Home', icon: 'carbon:workspace', to: '/' },
			{ label: 'Data', type: 'label' },
			{ label: 'Table', icon: 'carbon:data-table', to: '/table' },
		],
	},
});

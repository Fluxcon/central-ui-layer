// @ts-check
import withNuxt from './playground/.nuxt/eslint.config.mjs';

export default withNuxt(
	{ files: ['playground/app/pages/**'], rules: { 'vue/multi-word-component-names': 'off' } },
	{
	rules: {
		// `void: 'any'`, not `'never'`: Prettier unconditionally prints `<br />` and has no
		// option to stop, so anything else here loses the fight on every format-on-save.
		'vue/html-self-closing': ['error', { html: { void: 'any', normal: 'always', component: 'always' } }],
	},
},
);

import { defineConfig, globalIgnores } from 'eslint/config';
import ts from 'eslint-config-cheminfo-typescript';

const mergedConfig = {
	...(ts || {}),
	rules: {
		...((ts && ts.rules) || {}),
		// allow console.* (e.g. console.log) in this project
		'no-console': 'off',
	},
};

export default defineConfig(globalIgnores(['coverage', 'lib']), mergedConfig);

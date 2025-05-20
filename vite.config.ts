import react from '@vitejs/plugin-react';

import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler', // or "modern"
			},
		},
	},
	plugins: [
		react(),
		// svgr({
		// 	// svgr options: https://react-svgr.com/docs/options/
		// 	svgrOptions: {
		// 		// ...
		// 	},

		// 	// esbuild options, to transform jsx to js
		// 	esbuildOptions: {
		// 		// ...
		// 	},

		// 	// A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include.
		// 	include: '**/*.svg?react',

		// 	//  A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should ignore. By default no files are ignored.
		// 	exclude: '',
		// }),
		// mkcert(),
	],
	// resolve: {
	// 	alias: {
	// 		'/vite.svg': '/src/assets/vite.svg',
	// 		'/taipei-map.svg': '/src/assets/taipei-map.svg',
	// 	},
	// },
});

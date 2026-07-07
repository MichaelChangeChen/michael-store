import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const appBase = env.VITE_APP_BASE || '/'

	return {
		plugins: [
			vue(),
			vueJsx(),
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url))
			}
		},
		css: {
			preprocessorOptions: {
				sass: {
					additionalData: `@import '@/assets/scss/vuetify/variables';`
				},
				scss: {
					additionalData: `@import "@/assets/scss/_varibles.scss";`
				}
			}
		},
		server: {
			port: 8081,
			open: true
		},
		build: {
			sourcemap: false,
			outDir: 'dist',
			assetsDir: '',
		},
		base: appBase
	}
})

import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	const apiOrigin = env.VITE_API_ORIGIN || 'https://ps-store-backend-uucr.onrender.com'
	const apiPath = env.VITE_API_PATH || ''
	const publicPath = env.VITE_PUBLIC_PATH || ''
	const uploadPath = env.VITE_UPLOAD_PATH || ''
	const proxy = {}

	if(apiPath)
		proxy[apiPath] = {
			target: apiOrigin,
			changeOrigin: true,
		}

	if(publicPath)
		proxy[publicPath] = {
			target: apiOrigin,
			changeOrigin: true,
		}

	if(uploadPath)
		proxy[uploadPath] = {
			target: apiOrigin,
			changeOrigin: true,
		}

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
			proxy,
			open: true
		},
		build: {
			sourcemap: false,
			outDir: 'dist',
			assetsDir: '',
		},
		base: '/'
	}
})

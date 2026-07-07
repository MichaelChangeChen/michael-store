import { defineComponent, computed } from 'vue';
	import { storeToRefs } from 'pinia';
	import { useRoute } from 'vue-router';
	import useStore from '@/stores/useStores.js';
	import MainLayout from '@/layouts/MainLayout.vue';
	import SideLayout from '@/layouts/SideLayout.vue';
	import ErrorLayout from '@/layouts/ErrorLayout.vue';
	import Loading from '@/pages/components/Loading.vue';
	import SimpleLayout from '@/layouts/SimpleLayout.vue';
	import OperationNotice from '@/pages/components/dialog/OperationNotice.vue';

export default defineComponent({
	name: 'App',
	components: {
		MainLayout,
		SideLayout,
		ErrorLayout,
		Loading,
		SimpleLayout,
		OperationNotice
	},
	setup() {
const 	store = useStore(),
			route = useRoute(),
			{ 	isLoading,
				notice,
				isForm } = storeToRefs(store),
			{ hideNotice } = store,
			layoutMap = {
				error: ErrorLayout,
				simple: SimpleLayout,
				main: MainLayout,
				side: SideLayout
			};
	const 	currentLayout = computed(() => layoutMap[route.meta.layout || 'simple']);
	isForm.value = computed(() => route.meta.isForm);

		return {
			store,
			route,
			isLoading,
			notice,
			isForm,
			hideNotice,
			layoutMap,
			currentLayout
		};
	}
});

import { defineComponent, computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDisplay } from 'vuetify';
import useStore from '@/stores/useStores.js';
import EipSidebarRail from '@/layouts/components/EipSidebarRail.vue';

export default defineComponent({
	name: 'SideLayout',
	components: {
		EipSidebarRail
	},
	setup() {
const store = useStore();
const { isForm } = storeToRefs(store);
const { xs, sm } = useDisplay();

const isMobile = computed(() => xs.value || sm.value);
const sidebarOpen = ref(false);
const handleSearch = () => {
	console.log('搜尋: ');
}

watch(
	isMobile,
	mobile => {
		sidebarOpen.value = !mobile;
	},
	{ immediate: true }
);

		return {
			store,
			isForm,
			xs,
			sm,
			isMobile,
			sidebarOpen,
			handleSearch
		};
	}
});

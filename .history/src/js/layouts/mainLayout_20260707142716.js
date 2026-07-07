import { computed, defineComponent, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDisplay } from 'vuetify';
import { useRoute, useRouter } from 'vue-router';
import {  } from '@/api/scsApi.js';
import useStore from '@/stores/useStores.js';
import EipSidebarRailItem from '@/layouts/components/EipSidebarRailItem.vue';

export default defineComponent({
	name: 'MainLayout',
	components: {
		EipSidebarRailItem
	},
	setup() {
		const store = useStore();
		const router = useRouter();
		const route = useRoute();
		const { isForm, setMenu } = storeToRefs(store);
		const { showNotice, setMenuData } = store;
		const { xs, sm } = useDisplay();
		const isMobile = computed(() => xs.value || sm.value);
		const drawer = ref(true);
		const rail = ref(false);
		const expandedGroupIds = ref([]);

		const fallbackNavItems = [
			{
				text: '遊戲管理',
				icon: 'mdi-controller-classic-outline',
				link: '/games-mgnt'
			}
		];
		const navItems = computed(() => (
			Array.isArray(setMenu.value) && setMenu.value.length > 0
				? setMenu.value
				: fallbackNavItems
		));
		const routePath = computed(() => route.path);
		const showSidebarContent = computed(() => isMobile.value || !rail.value);
		const showLogout = computed(() => showSidebarContent.value);
		const isGroupViewOpen = computed(() => isMobile.value || !rail.value);
		const searchInputProps = computed(() => ({
			placeholder: '搜尋模組、頁面或任務節點',
			appendInnerIcon: 'mdi-magnify',
			baseColor: 'cyan-lighten-1',
			bgColor: 'rgba(10, 18, 37, 0.88)',
			rounded: 'pill',
			color: 'cyan-lighten-1'
		}));
		const searchInputEvents = {
			'click:append-inner': () => {}
		};

		const toggleDrawer = () => {
			if(isMobile.value)
				drawer.value = !drawer.value;
			else {
				rail.value = !rail.value;
				if(rail.value)
					expandedGroupIds.value = [];
			}
		};

		const toggleGroup = nodeKey => {
			if(!isGroupViewOpen.value)
				return;

			const next = new Set(expandedGroupIds.value);
			if(next.has(nodeKey))
				next.delete(nodeKey);
			else
				next.add(nodeKey);

			expandedGroupIds.value = Array.from(next);
		};

		const handleLogout = () => {
			logout()
			.then(res => {
				if([ 1, '1', 200, '200' ].includes(res?.data?.statusCode) || res?.status === 200) {
					sessionStorage.removeItem('authFuncMenu');
					sessionStorage.removeItem('memberProfile');
					sessionStorage.removeItem('LoginAuth');
					setMenuData([]);
					router.replace({ name: 'loginPage' });
					showNotice('已成功登出', 'success', '系統通知');
				}
				else
					showNotice(res?.data?.message || '登出失敗', 'error', '系統通知');
			})
			.catch(err => {
				showNotice(err?.response?.data?.message || err?.message || '登出失敗', 'error', '系統通知');
			});
		};

		watch(
			isMobile,
			mobile => {
				drawer.value = !mobile;
				rail.value = false;
				expandedGroupIds.value = [];
			},
			{ immediate: true }
		);

		return {
			drawer,
			rail,
			navItems,
			routePath,
			isForm,
			isMobile,
			showSidebarContent,
			showLogout,
			isGroupViewOpen,
			searchInputProps,
			searchInputEvents,
			expandedGroupIds,
			toggleDrawer,
			toggleGroup,
			handleLogout
		};
	}
});

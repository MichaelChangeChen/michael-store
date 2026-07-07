import { computed, defineComponent, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import {  } from '@/api/scsApi.js';
import useStore from '@/stores/useStores.js';
import EipSidebarRailItem from '@/layouts/components/EipSidebarRailItem.vue';

export default defineComponent({
	name: 'EipSidebarRail',
	components: {
		EipSidebarRailItem
	},
	props: {
		modelValue: {
			type: Boolean,
			default: false
		},
		isMobile: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:modelValue'],
	setup(props, { emit }) {
		const 	store = useStore(),
				router = useRouter(),
				route = useRoute(),
				{ setMenu } = storeToRefs(store),
				{ showNotice, setMenuData } = store;
		const 	isHovering = ref(false),
				isRail = ref(!props.isMobile),
				expandedGroupIds = ref([]);

		const navItems = computed(() => Array.isArray(setMenu.value) ? setMenu.value : []);
		const routePath = computed(() => route.path);
		const drawerOpen = computed({
			get: () => props.modelValue,
			set: value => emit('update:modelValue', value)
		});
		const showLogout = computed(() => props.isMobile || !isRail.value);
		const isGroupViewOpen = computed(() => props.isMobile || isHovering.value);

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

		const onHoverIn = () => {
			if(props.isMobile)
				return;

			isHovering.value = true;
		};

		const onHoverOut = () => {
			if(props.isMobile)
				return;

			isHovering.value = false;
			expandedGroupIds.value = [];
		};

		const onRailUpdate = value => {
			isRail.value = value;
			if(value && !props.isMobile)
				expandedGroupIds.value = [];
		};

		const handleLogout = () => {
			// logout()
			// .then(res => {
			// 	if([ 1, '1', 200, '200' ].includes(res?.data?.statusCode) || res?.status === 200) {
			// 		sessionStorage.removeItem('authFuncMenu');
			// 		sessionStorage.removeItem('memberProfile');
			// 		sessionStorage.removeItem('LoginAuth');
			// 		setMenuData([]);
			// 		router.replace({ name: 'loginPage' });
			// 		showNotice('登出成功。', 'success', '完成');
			// 	}
			// 	else {
			// 		showNotice(res?.data?.message || '登出失敗。', 'error', '錯誤');
			// 	}
			// })
			// .catch(err => {
			// 	showNotice(err?.response?.data?.message || err?.message || '登出失敗。', 'error', '錯誤');
			// });
		};

		return {
			navItems,
			routePath,
			drawerOpen,
			showLogout,
			isGroupViewOpen,
			expandedGroupIds,
			toggleGroup,
			onHoverIn,
			onHoverOut,
			onRailUpdate,
			handleLogout,
			emit
		};
	}
});

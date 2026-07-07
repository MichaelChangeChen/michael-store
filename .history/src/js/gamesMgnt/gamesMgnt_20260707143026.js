import { computed, defineComponent, reactive, ref } from 'vue';
import useStore from '@/stores/useStores.js';
import DatatableComponent from '@/components/DatatableComponent.vue';

const gameStatusOptions = [
	{ title: '全部狀態', value: 'all' },
	{ title: '上架中', value: 'online' },
	{ title: '維護中', value: 'maintenance' },
	{ title: '下架', value: 'offline' }
];

const platformOptions = [
	{ title: '全部平台', value: 'all' },
	{ title: 'PC', value: 'PC' },
	{ title: 'Mobile', value: 'Mobile' },
	{ title: 'Console', value: 'Console' }
];

const initialGames = [
	{
		id: 1001,
		name: 'Aurora Strike',
		category: '射擊',
		platform: 'PC',
		status: 'online',
		rating: 4.8,
		players: 12840,
		releaseDate: '2026-03-11',
		featured: true
	},
	{
		id: 1002,
		name: 'Pocket Farmer',
		category: '模擬',
		platform: 'Mobile',
		status: 'maintenance',
		rating: 4.2,
		players: 8630,
		releaseDate: '2026-01-20',
		featured: false
	},
	{
		id: 1003,
		name: 'Neon Rally X',
		category: '競速',
		platform: 'Console',
		status: 'online',
		rating: 4.6,
		players: 9450,
		releaseDate: '2025-12-05',
		featured: true
	},
	{
		id: 1004,
		name: 'Castle of Echoes',
		category: 'RPG',
		platform: 'PC',
		status: 'offline',
		rating: 3.9,
		players: 2140,
		releaseDate: '2025-10-14',
		featured: false
	}
];

const statusMetaMap = {
	online: { label: '上架中', color: 'success' },
	maintenance: { label: '維護中', color: 'warning' },
	offline: { label: '下架', color: 'error' }
};

export default defineComponent({
	name: 'GamesMgnt',
	components: {
		DatatableComponent
	},
	setup() {
		const { showNotice } = useStore();
		const keyword = ref('');
		const selectedRows = ref([]);
		const filters = reactive({
			status: 'all',
			platform: 'all',
			featuredOnly: false
		});
		const games = ref(initialGames.map(item => ({ ...item })));
		const headers = [
			{ title: '遊戲代碼', key: 'id', width: 120 },
			{ title: '遊戲名稱', key: 'name', minWidth: 180 },
			{ title: '類型', key: 'category', width: 120 },
			{ title: '平台', key: 'platform', width: 120 },
			{ title: '狀態', key: 'status', width: 120 },
			{ title: '評分', key: 'rating', width: 100 },
			{ title: '玩家數', key: 'players', width: 120 },
			{ title: '上市日', key: 'releaseDate', width: 140 },
			{ title: '操作', key: 'btns', sortable: false, width: 180 }
		];

		const statusSummary = computed(() => games.value.reduce((summary, game) => {
			summary.total += 1;
			if(game.status === 'online')
				summary.online += 1;
			if(game.featured)
				summary.featured += 1;
			return summary;
		}, {
			total: 0,
			online: 0,
			featured: 0
		}));

		const filteredGames = computed(() => games.value.filter(game => {
			const matchKeyword = !keyword.value || [
				game.name,
				game.category,
				String(game.id)
			].some(value => String(value).toLowerCase().includes(keyword.value.trim().toLowerCase()));
			const matchStatus = filters.status === 'all' || game.status === filters.status;
			const matchPlatform = filters.platform === 'all' || game.platform === filters.platform;
			const matchFeatured = !filters.featuredOnly || game.featured;

			return matchKeyword && matchStatus && matchPlatform && matchFeatured;
		}));

		const resetFilters = () => {
			keyword.value = '';
			filters.status = 'all';
			filters.platform = 'all';
			filters.featuredOnly = false;
		};

		const getStatusMeta = status => statusMetaMap[status] || { label: status || '未知', color: 'default' };

		const toggleFeatured = game => {
			game.featured = !game.featured;
			showNotice(`${game.name} 已${game.featured ? '加入' : '移出'}精選`, 'success', '遊戲管理');
		};

		const cycleStatus = game => {
			const statusOrder = [ 'online', 'maintenance', 'offline' ];
			const nextIndex = (statusOrder.indexOf(game.status) + 1) % statusOrder.length;
			game.status = statusOrder[nextIndex];
			showNotice(`${game.name} 狀態已更新為 ${getStatusMeta(game.status).label}`, 'info', '遊戲管理');
		};

		const bulkSetOffline = () => {
			if(selectedRows.value.length === 0) {
				showNotice('請先勾選要下架的遊戲', 'warning', '遊戲管理');
				return;
			}

			selectedRows.value.forEach(row => {
				const target = games.value.find(game => game.id === row.id);
				if(target)
					target.status = 'offline';
			});
			showNotice(`已下架 ${selectedRows.value.length} 筆遊戲`, 'success', '遊戲管理');
			selectedRows.value = [];
		};

		return {
			headers,
			games,
			keyword,
			filters,
			selectedRows,
			platformOptions,
			gameStatusOptions,
			statusSummary,
			filteredGames,
			resetFilters,
			getStatusMeta,
			toggleFeatured,
			cycleStatus,
			bulkSetOffline
		};
	}
});

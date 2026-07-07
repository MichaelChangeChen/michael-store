import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { deleteGame, getGameList, updateGame } from '@/api/scsApi.js';
import useStore from '@/stores/useStores.js';
import DatatableComponent from '@/pages/components/table/DatatableComponent.vue';

const gameStatusOptions = [
	{ title: '全部狀態', value: 'all' },
	{ title: '上架中', value: 'online' },
	{ title: '維護中', value: 'maintenance' },
	{ title: '已下架', value: 'offline' }
];

const platformOptions = [
	{ title: '全部平台', value: 'all' },
	{ title: 'PC', value: 'PC' },
	{ title: 'Mobile', value: 'Mobile' },
	{ title: 'Console', value: 'Console' }
];

const statusMetaMap = {
	online: { label: '上架中', color: 'success' },
	maintenance: { label: '維護中', color: 'warning' },
	offline: { label: '已下架', color: 'error' }
};

const mapStatusValue = (status) => {
	const normalizedStatus = String(status ?? '').trim().toLowerCase();

	if([ 'online', 'enabled', 'active', 'published', '1', 'true', '上架中', '上架' ].includes(normalizedStatus))
		return 'online';

	if([ 'maintenance', 'maintaining', 'pending', '2', '維護中', '維護' ].includes(normalizedStatus))
		return 'maintenance';

	if([ 'offline', 'disabled', 'inactive', 'archived', '0', 'false', '已下架', '下架' ].includes(normalizedStatus))
		return 'offline';

	return normalizedStatus || 'offline';
};

const normalizeGame = (item, index) => {
	const normalizedStatus = mapStatusValue(
		item?.status
		?? item?.gameStatus
		?? item?.onlineStatus
		?? item?.state
	);

	return {
		uuid: item?.uuid ?? item?._id ?? item?.id ?? `game-${index + 1}`,
		id: item?.id ?? item?.gameId ?? item?.code ?? index + 1,
		name: item?.name ?? item?.gameName ?? item?.title ?? `遊戲 ${index + 1}`,
		category: item?.category ?? item?.gameCategory ?? item?.type ?? '未分類',
		platform: item?.platform ?? item?.gamePlatform ?? item?.device ?? 'PC',
		status: normalizedStatus,
		rating: Number(item?.rating ?? item?.score ?? item?.stars ?? 0),
		players: Number(item?.players ?? item?.playerCount ?? item?.users ?? 0),
		releaseDate: item?.releaseDate ?? item?.launchDate ?? item?.createdAt ?? '',
		featured: Boolean(item?.featured ?? item?.isFeatured ?? item?.recommend ?? false),
		raw: item
	};
};

const buildUpdatePayload = (game) => ({
	uuid: game.uuid,
	id: game.id,
	gameId: game.id,
	name: game.name,
	gameName: game.name,
	category: game.category,
	gameCategory: game.category,
	platform: game.platform,
	gamePlatform: game.platform,
	status: game.status,
	gameStatus: game.status,
	onlineStatus: game.status,
	rating: game.rating,
	score: game.rating,
	players: game.players,
	playerCount: game.players,
	releaseDate: game.releaseDate,
	launchDate: game.releaseDate,
	featured: game.featured,
	isFeatured: game.featured
});

const getResponseList = (res) => {
	const source = res?.data;

	if(Array.isArray(source))
		return source;

	if(Array.isArray(source?.data))
		return source.data;

	if(Array.isArray(source?.rows))
		return source.rows;

	if(Array.isArray(source?.list))
		return source.list;

	return [];
};

const getResponseTotal = (res, fallbackLength) => {
	const total = Number(
		res?.data?.totalCount
		?? res?.data?.total
		?? res?.data?.count
		?? fallbackLength
	);

	return Number.isFinite(total) ? total : fallbackLength;
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
		const listLoading = ref(false);
		const games = ref([]);
		const page = ref(1);
		const pageSize = ref(10);
		const totalCount = ref(0);
		const maxPage = ref(1);
		const filters = reactive({
			status: 'all',
			platform: 'all',
			featuredOnly: false
		});

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

		const filteredGames = computed(() => games.value.filter((game) => {
			const matchKeyword = !keyword.value || [
				game.name,
				game.category,
				String(game.id)
			].some((value) => String(value).toLowerCase().includes(keyword.value.trim().toLowerCase()));
			const matchStatus = filters.status === 'all' || game.status === filters.status;
			const matchPlatform = filters.platform === 'all' || game.platform === filters.platform;
			const matchFeatured = !filters.featuredOnly || game.featured;

			return matchKeyword && matchStatus && matchPlatform && matchFeatured;
		}));

		const getStatusMeta = (status) => statusMetaMap[status] || { label: status || '未知', color: 'default' };

		const fetchGameList = () => {
			listLoading.value = true;

			getGameList({
				page: page.value,
				pageSize: pageSize.value
			})
			.then((res) => {
				const rows = getResponseList(res).map(normalizeGame);
				const nextTotalCount = getResponseTotal(res, rows.length);

				games.value = rows;
				totalCount.value = nextTotalCount;
				maxPage.value = Math.max(1, Math.ceil(nextTotalCount / pageSize.value));
			})
			.catch((err) => {
				showNotice(err?.response?.data?.message || err?.message || '讀取遊戲清單失敗', 'error', '遊戲管理');
			})
			.finally(() => {
				listLoading.value = false;
			});
		};

		const resetFilters = () => {
			keyword.value = '';
			filters.status = 'all';
			filters.platform = 'all';
			filters.featuredOnly = false;
		};

		const onTableOptionsChange = (options) => {
			const nextPage = Number(options?.page) || 1;
			const nextPageSize = Number(options?.itemsPerPage) || 10;

			if(page.value === nextPage && pageSize.value === nextPageSize)
				return;

			page.value = nextPage;
			pageSize.value = nextPageSize;
			fetchGameList();
		};

		const toggleFeatured = (game) => {
			const nextFeatured = !game.featured;

			updateGame({
				...buildUpdatePayload(game),
				featured: nextFeatured,
				isFeatured: nextFeatured
			})
			.then((res) => {
				if([ 1, '1', 200, '200' ].includes(res?.data?.statusCode) || res?.status === 200) {
					game.featured = nextFeatured;
					showNotice(`${game.name} 已${game.featured ? '加入' : '移出'}精選`, 'success', '遊戲管理');
				}
				else
					showNotice(res?.data?.message || '更新精選狀態失敗', 'error', '遊戲管理');
			})
			.catch((err) => {
				showNotice(err?.response?.data?.message || err?.message || '更新精選狀態失敗', 'error', '遊戲管理');
			});
		};

		const cycleStatus = (game) => {
			const statusOrder = [ 'online', 'maintenance', 'offline' ];
			const nextIndex = (statusOrder.indexOf(game.status) + 1) % statusOrder.length;
			const nextStatus = statusOrder[nextIndex];

			updateGame({
				...buildUpdatePayload(game),
				status: nextStatus,
				gameStatus: nextStatus,
				onlineStatus: nextStatus
			})
			.then((res) => {
				if([ 1, '1', 200, '200' ].includes(res?.data?.statusCode) || res?.status === 200) {
					game.status = nextStatus;
					showNotice(`${game.name} 狀態已更新為 ${getStatusMeta(game.status).label}`, 'info', '遊戲管理');
				}
				else
					showNotice(res?.data?.message || '更新遊戲狀態失敗', 'error', '遊戲管理');
			})
			.catch((err) => {
				showNotice(err?.response?.data?.message || err?.message || '更新遊戲狀態失敗', 'error', '遊戲管理');
			});
		};

		const bulkSetOffline = () => {
			if(selectedRows.value.length === 0) {
				showNotice('請先勾選要下架的遊戲', 'warning', '遊戲管理');
				return;
			}

			Promise.all(selectedRows.value.map((row) => updateGame({
				...buildUpdatePayload(row),
				status: 'offline',
				gameStatus: 'offline',
				onlineStatus: 'offline'
			})))
			.then(() => {
				games.value = games.value.map((game) => (
					selectedRows.value.some((row) => row.uuid === game.uuid || row.id === game.id)
						? { ...game, status: 'offline' }
						: game
				));
				showNotice(`已下架 ${selectedRows.value.length} 筆遊戲`, 'success', '遊戲管理');
				selectedRows.value = [];
			})
			.catch((err) => {
				showNotice(err?.response?.data?.message || err?.message || '批次下架失敗', 'error', '遊戲管理');
			});
		};

		const removeGame = (game) => {
			const targetKey = game.uuid || game.id;

			deleteGame(targetKey)
			.then((res) => {
				if([ 1, '1', 200, '200' ].includes(res?.data?.statusCode) || res?.status === 200) {
					games.value = games.value.filter((item) => item.uuid !== game.uuid && item.id !== game.id);
					totalCount.value = Math.max(0, totalCount.value - 1);
					showNotice(`${game.name} 已刪除`, 'success', '遊戲管理');
				}
				else
					showNotice(res?.data?.message || '刪除遊戲失敗', 'error', '遊戲管理');
			})
			.catch((err) => {
				showNotice(err?.response?.data?.message || err?.message || '刪除遊戲失敗', 'error', '遊戲管理');
			});
		};

		onMounted(() => {
			fetchGameList();
		});

		return {
			headers,
			games,
			keyword,
			filters,
			selectedRows,
			listLoading,
			page,
			pageSize,
			totalCount,
			maxPage,
			platformOptions,
			gameStatusOptions,
			statusSummary,
			filteredGames,
			resetFilters,
			getStatusMeta,
			onTableOptionsChange,
			toggleFeatured,
			cycleStatus,
			bulkSetOffline,
			removeGame
		};
	}
});

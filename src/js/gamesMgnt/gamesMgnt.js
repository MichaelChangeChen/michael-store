import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { deleteGame, getGameList } from '@/api/scsApi.js';
import useStore from '@/stores/useStores.js';
import DatatableComponent from '@/pages/components/table/DatatableComponent.vue';

const typeOptions = [
	{ title: '全部類型', value: 'all' },
	{ title: 'RPG', value: 'RPG' },
	{ title: '動作', value: '動作' },
	{ title: '動作冒險', value: '動作冒險' },
	{ title: '競速', value: '競速' },
	{ title: '恐怖', value: '恐怖' }
];

const stockOptions = [
	{ title: '全部庫存', value: 'all' },
	{ title: '有庫存', value: 'in-stock' },
	{ title: '低庫存', value: 'low-stock' },
	{ title: '已售完', value: 'out-of-stock' }
];

const getStockMeta = (quantity) => {
	if(quantity <= 0)
		return { label: '已售完', color: 'error' };

	if(quantity <= 3)
		return { label: '低庫存', color: 'warning' };

	return { label: '有庫存', color: 'success' };
};

const normalizeGame = (item, index) => ({
	uuid: item?.uuid ?? `game-${index + 1}`,
	chiName: item?.chiName ?? `商品 ${index + 1}`,
	engName: item?.engName ?? '-',
	price: Number(item?.price ?? 0),
	quantity: Number(item?.quantity ?? 0),
	type: item?.type ?? '未分類',
	url: item?.url ?? '',
	stockStatus: getStockMeta(Number(item?.quantity ?? 0))
});

const getResponseList = (res) => {
	if(Array.isArray(res?.data?.data?.itemList))
		return res.data.data.itemList;

	if(Array.isArray(res?.data?.data))
		return res.data.data;

	if(Array.isArray(res?.data?.list))
		return res.data.list;

	return [];
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
			type: 'all',
			stock: 'all'
		});

		const headers = [
			{ title: '封面', key: 'cover', sortable: false, width: 92 },
			{ title: '中文名稱', key: 'chiName', minWidth: 220 },
			{ title: '英文名稱', key: 'engName', minWidth: 220 },
			{ title: '類型', key: 'type', width: 120 },
			{ title: '價格', key: 'price', width: 120 },
			{ title: '庫存', key: 'quantity', width: 100 },
			{ title: '狀態', key: 'stockStatus', width: 120 },
			{ title: '操作', key: 'btns', sortable: false, width: 120 }
		];

		const statusSummary = computed(() => games.value.reduce((summary, game) => {
			summary.total += 1;
			summary.stock += game.quantity;
			if(game.quantity <= 3)
				summary.lowStock += 1;
			return summary;
		}, {
			total: 0,
			stock: 0,
			lowStock: 0
		}));

		const filteredGames = computed(() => games.value.filter((game) => {
			const normalizedKeyword = keyword.value.trim().toLowerCase();
			const matchKeyword = !normalizedKeyword || [
				game.chiName,
				game.engName,
				game.type,
				game.uuid
			].some((value) => String(value).toLowerCase().includes(normalizedKeyword));
			const matchType = filters.type === 'all' || game.type === filters.type;
			const matchStock = (
				filters.stock === 'all'
				|| (filters.stock === 'in-stock' && game.quantity > 3)
				|| (filters.stock === 'low-stock' && game.quantity > 0 && game.quantity <= 3)
				|| (filters.stock === 'out-of-stock' && game.quantity <= 0)
			);

			return matchKeyword && matchType && matchStock;
		}));

		const fetchGameList = () => {
			listLoading.value = true;

			getGameList({
				page: page.value,
				pageSize: pageSize.value
			})
			.then((res) => {
				if(![ 1, '1', 200, '200' ].includes(res?.data?.statusCode) && res?.status !== 200) {
					showNotice(res?.data?.message || '讀取商品清單失敗', 'error', '遊戲管理');
					return;
				}

				games.value = getResponseList(res).map(normalizeGame);
				page.value = Number(res?.data?.data?.currentPage ?? page.value) || 1;
				pageSize.value = Number(res?.data?.data?.pageSize ?? pageSize.value) || 10;
				totalCount.value = Number(res?.data?.data?.totalCount ?? games.value.length) || games.value.length;
				maxPage.value = Number(res?.data?.data?.totalPages ?? 1) || 1;
			})
			.catch((err) => {
				showNotice(err?.response?.data?.message || err?.message || '讀取商品清單失敗', 'error', '遊戲管理');
			})
			.finally(() => {
				listLoading.value = false;
			});
		};

		const resetFilters = () => {
			keyword.value = '';
			filters.type = 'all';
			filters.stock = 'all';
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

		const removeGame = (game) => {
			deleteGame(game.uuid)
			.then((res) => {
				if([ 1, '1', 200, '200' ].includes(res?.data?.statusCode) || res?.status === 200) {
					games.value = games.value.filter((item) => item.uuid !== game.uuid);
					totalCount.value = Math.max(0, totalCount.value - 1);
					showNotice(`${game.chiName} 已刪除`, 'success', '遊戲管理');
				}
				else
					showNotice(res?.data?.message || '刪除商品失敗', 'error', '遊戲管理');
			})
			.catch((err) => {
				showNotice(err?.response?.data?.message || err?.message || '刪除商品失敗', 'error', '遊戲管理');
			});
		};

		const bulkSetOffline = () => {
			if(selectedRows.value.length === 0) {
				showNotice('請先勾選要刪除的商品', 'warning', '遊戲管理');
				return;
			}

			Promise.all(selectedRows.value.map((row) => deleteGame(row.uuid)))
			.then(() => {
				const selectedIds = new Set(selectedRows.value.map((row) => row.uuid));
				games.value = games.value.filter((game) => !selectedIds.has(game.uuid));
				totalCount.value = Math.max(0, totalCount.value - selectedIds.size);
				selectedRows.value = [];
				showNotice('已刪除選取商品', 'success', '遊戲管理');
			})
			.catch((err) => {
				showNotice(err?.response?.data?.message || err?.message || '批次刪除商品失敗', 'error', '遊戲管理');
			});
		};

		onMounted(() => {
			fetchGameList();
		});

		return {
			headers,
			keyword,
			filters,
			selectedRows,
			listLoading,
			page,
			totalCount,
			maxPage,
			typeOptions,
			stockOptions,
			statusSummary,
			filteredGames,
			getStockMeta,
			resetFilters,
			onTableOptionsChange,
			removeGame,
			bulkSetOffline
		};
	}
});

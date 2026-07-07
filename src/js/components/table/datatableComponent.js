import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

export default defineComponent({
	name: 'DatatableComponent',
	props: {
		headers: {
			type: Array,
			required: true
		},
		items: {
			type: Array,
			default: () => []
		},
		modelValue: {
			type: Array,
			default: undefined
		},
		value: {
			type: [String, Number, Object, Array],
			default: () => []
		},
		totalItems: {
			type: [String, Number],
			default: 0
		},
		linesPerPage: {
			type: Array,
			default: () => [
				{ text: '10', value: 10 },
				{ text: '50', value: 50 },
				{ text: '100', value: 100 }
			]
		},
		totalCount: {
			type: [String, Number],
			default: 0
		},
		maxPage: {
			type: [String, Number],
			default: 1
		},
		currentPage: {
			type: [String, Number],
			default: 1
		},
		isDisabledSort: {
			type: Boolean,
			default: true
		},
		itemKey: {
			type: String,
			default: 'id'
		},
		setHeader: {
			type: String,
			default: ''
		},
		isShowSelect: {
			type: Boolean,
			default: false
		},
		hideFooter: {
			type: Boolean,
			default: false
		},
		loading: {
			type: [Boolean, String],
			default: false
		},
		search: {
			type: String,
			default: ''
		},
		noDataText: {
			type: String,
			default: '目前沒有符合條件的資料'
		},
		fixedHeader: {
			type: Boolean,
			default: true
		},
		tableHeight: {
			type: [String, Number],
			default: '62vh'
		}
	},
	emits: [
		'datatableOptions',
		'input',
		'toggleSelectAll',
		'update:modelValue',
		'update:page',
		'update:itemsPerPage',
		'update:sortBy'
	],
	setup(props, { emit }) {
		const datatableRoot = ref(null);
		const tableWrapper = ref(null);
		const isAssistiveBar = ref(false);
		const animationFrameId = ref(null);
		const page = ref(Number(props.currentPage) || 1);
		const itemsPerPage = ref(10);
		const sortBy = ref([]);
		const selectedRows = ref(Array.isArray(props.modelValue) ? props.modelValue : (Array.isArray(props.value) ? props.value : []));

		const normalizedHeaders = computed(() => props.headers.map((header) => {
			const key = header.key ?? header.value;
			const headerClass = header.class ?? '';
			const headerProps = header.headerProps ?? {};
			const cellProps = header.cellProps ?? {};
			return {
				...header,
				key,
				title: header.title ?? header.text ?? header.label ?? key ?? '',
				sortable: props.isDisabledSort ? false : (header.sortable ?? true),
				headerProps: headerClass ? { ...headerProps, class: [headerProps.class, headerClass].filter(Boolean).join(' ') } : headerProps,
				cellProps: headerClass ? { ...cellProps, class: [cellProps.class, headerClass].filter(Boolean).join(' ') } : cellProps
			};
		}));

		const bodyHeaders = computed(() => normalizedHeaders.value.filter((header) => header.key !== 'data-table-select'));

		const resolvedItemsPerPageOptions = computed(() => props.linesPerPage.map((item) => (
			typeof item === 'number' ? item : Number(item.value)
		)).filter(Number.isFinite));

		const resolvedItemsLength = computed(() => {
			const total = Number(props.totalItems);
			return Number.isFinite(total) && total > 0 ? total : props.items.length;
		});

		const resolvedItemValue = computed(() => props.itemKey || 'id');

		const syncWrapperState = () => {
			if(!datatableRoot.value)
				return;

			tableWrapper.value = datatableRoot.value.querySelector('.v-table__wrapper');
			if(!tableWrapper.value)
				return;

			isAssistiveBar.value = tableWrapper.value.scrollWidth > tableWrapper.value.clientWidth;
		};

		const overAssistiveBar = (side) => {
			if(!tableWrapper.value)
				return;

			const maxWidth = tableWrapper.value.scrollWidth - tableWrapper.value.clientWidth;
			const scrollSpeed = 12;

			const step = () => {
				if(side === 'left')
					tableWrapper.value.scrollLeft -= scrollSpeed;
				else
					tableWrapper.value.scrollLeft += scrollSpeed;

				if(tableWrapper.value.scrollLeft > 0 && tableWrapper.value.scrollLeft < maxWidth) {
					animationFrameId.value = requestAnimationFrame(step);
					return;
				}
				cancelAnimationFrame(animationFrameId.value);
			};

			animationFrameId.value = requestAnimationFrame(step);
		};

		const outAssistiveBar = () => {
			cancelAnimationFrame(animationFrameId.value);
		};

		const onUpdatePage = (nextPage) => {
			page.value = nextPage;
			emit('update:page', nextPage);
		};

		const onUpdateItemsPerPage = (nextItemsPerPage) => {
			itemsPerPage.value = nextItemsPerPage;
			emit('update:itemsPerPage', nextItemsPerPage);
		};

		const onUpdateSortBy = (nextSortBy) => {
			sortBy.value = nextSortBy;
			emit('update:sortBy', nextSortBy);
		};

		const onUpdateOptions = (options) => {
			emit('datatableOptions', options);
		};

		const getRow = (item) => item?.raw ?? item ?? {};

		const selectRow = (slotProps, value) => {
			const nextValue = typeof value === 'boolean' ? value : !Boolean(slotProps?.props?.modelValue);
			const currentValue = Boolean(slotProps?.props?.modelValue);

			if(nextValue === currentValue)
				return;

			slotProps?.toggleSelect?.(slotProps?.internalItem, slotProps?.index);
		};

		const selectAllRows = (selectAll, value) => {
			const nextValue = Boolean(value);
			selectAll(nextValue);
			emit('toggleSelectAll', nextValue);
		};

		const formatCell = (item, key) => {
			const value = item?.[key];
			if(value === null || value === undefined)
				return '';
			return Array.isArray(value) ? value.join(', ') : value;
		};

		watch(() => props.currentPage, (nextPage) => {
			page.value = Number(nextPage) || 1;
		}, { immediate: true });

		watch(selectedRows, (rows) => {
			emit('update:modelValue', rows);
			emit('input', rows);
		}, { deep: true });

		watch(() => props.modelValue, (rows) => {
			if(Array.isArray(rows))
				selectedRows.value = rows;
		}, { deep: true });

		watch(() => props.value, (rows) => {
			if(props.modelValue === undefined && Array.isArray(rows))
				selectedRows.value = rows;
		}, { deep: true });

		watch(() => props.items, async () => {
			await nextTick();
			syncWrapperState();
		}, { deep: true });

		onMounted(async () => {
			itemsPerPage.value = resolvedItemsPerPageOptions.value[0] ?? 10;
			await nextTick();
			syncWrapperState();
			window.addEventListener('resize', syncWrapperState);
		});

		onUnmounted(() => {
			outAssistiveBar();
			window.removeEventListener('resize', syncWrapperState);
		});

		return {
			datatableRoot,
			isAssistiveBar,
			page,
			sortBy,
			itemsPerPage,
			selectedRows,
			normalizedHeaders,
			bodyHeaders,
			resolvedItemsPerPageOptions,
			resolvedItemsLength,
			resolvedItemValue,
			overAssistiveBar,
			outAssistiveBar,
			onUpdatePage,
			onUpdateItemsPerPage,
			onUpdateSortBy,
			onUpdateOptions,
			getRow,
			selectRow,
			selectAllRows,
			formatCell
		};
	}
});

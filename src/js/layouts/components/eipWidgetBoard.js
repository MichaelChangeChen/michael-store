import { computed, defineComponent, ref } from 'vue';
import draggable from 'vuedraggable';
import { useRouter } from 'vue-router';
import ApexCharts from 'vue3-apexcharts';

const congressChartSeries = [ 7, 3, 2, 4 ];
const congressChartOptions = {
	chart: {
		type: 'donut',
		toolbar: { show: false }
	},
	colors: [ '#319795', '#D69E2E', '#975A16', '#F3F4F6' ],
	labels: [ '已辦結', '辦理中', '待回覆', '其他' ],
	dataLabels: { enabled: false },
	stroke: { width: 0 },
	legend: { show: false },
	plotOptions: {
		pie: {
			donut: {
				size: '70%'
			}
		}
	},
	tooltip: {
		theme: 'light'
	}
};

export default defineComponent({
	name: 'EipWidgetBoard',
	components: {
		draggable,
		ApexCharts
	},
	props: {
		modelValue: {
			type: Array,
			required: true
		}
	},
	emits: [ 'update:modelValue' ],
	setup(props, { emit }) {
		const route = useRouter();
		const model = computed({
			get: () => props.modelValue,
			set: value => emit('update:modelValue', value)
		});

		const statList = ref([
			{ id: 1, name: '會議室預約查詢', icon: 'mdi-calendar-outline' },
			{ id: 2, name: '通訊錄查詢', icon: 'mdi-magnify' },
			{ id: 3, name: '表單簽核查詢', icon: 'mdi-calendar-check-outline' },
			{ id: 4, name: '表單申請作業', icon: 'mdi-pencil', url: '/apply-main-page' }
		]);

		const shortcutList = ref([
			{ id: 1, name: 'Google Workspace', icon: 'mdi-account-cog-outline' },
			{ id: 2, name: '薪資差旅查詢', icon: 'mdi-currency-usd' },
			{ id: 3, name: '資安與個資教育訓練', icon: 'mdi-shield-check-outline' },
			{ id: 4, name: '新版會議資料整合查詢系統', icon: 'mdi-card-account-details-outline' }
		]);

		const todoBoxList = ref([
			{ id: 1, name: '待辦申請單', count: '14' },
			{ id: 2, name: '待簽核項目', count: '2' },
			{ id: 3, name: '待回覆通知', count: '3' },
			{ id: 4, name: '逾期案件', count: '1', isRed: true }
		]);

		const pageGoTo = (url) => {
			if(url)
				route.push(url);
		};

		return {
			model,
			todoBoxList,
			pageGoTo,
			statList,
			shortcutList,
			congressChartSeries,
			congressChartOptions
		};
	}
});

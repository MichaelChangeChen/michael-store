import { computed, defineComponent } from 'vue';
import EditorDialog from '@/pages/components/dialog/EditorDialog.vue';
import { getFormDetailContent, getFormDetailFlowRecords } from '@/js/forms/formDetailShared.js';

const actionChipColorMap = {
	送出: 'blue',
	重新送出: 'blue',
	通過: 'green',
	退回申請者: 'orange',
	不通過結案: 'red',
	待結案: 'grey'
};

export default defineComponent({
	name: 'CheckFormDetailDialog',
	components: {
		EditorDialog
	},
	props: {
		modelValue: {
			type: Boolean,
			default: undefined
		},
		isVisiable: {
			type: Boolean,
			default: false
		},
		formType: {
			type: String,
			default: ''
		},
		formName: {
			type: String,
			default: ''
		},
		title: {
			type: String,
			default: ''
		},
		maxWidth: {
			type: String,
			default: '860px'
		},
		height: {
			type: String,
			default: '80vh'
		},
		contentItems: {
			type: Array,
			default: () => []
		},
		flowRecords: {
			type: Array,
			default: () => []
		},
		contentHint: {
			type: String,
			default: '(此區域僅供檢視，無法編輯)'
		},
		flowTitle: {
			type: String,
			default: '簽核流程記錄'
		},
		contentTitle: {
			type: String,
			default: '表單內容'
		}
	},
	emits: [
		'update:modelValue',
		'close',
		'cancel'
	],
	setup(props, { emit }) {
		const visible = computed(() => (props.modelValue ?? props.isVisiable));

		const dialogTitle = computed(() => props.title || `表單檢視 - ${props.formName || ''}`);

		const displayContentItems = computed(() => {
			if(props.contentItems?.length)
				return props.contentItems;

			return getFormDetailContent(props.formType, props.formName);
		});

		const displayFlowRecords = computed(() => {
			if(props.flowRecords?.length)
				return props.flowRecords;

			return getFormDetailFlowRecords(props.formType);
		});

		const onVisibleChange = (value) => {
			emit('update:modelValue', value);
		};

		const closeDialog = () => {
			emit('update:modelValue', false);
			emit('close');
			emit('cancel');
		};

		return {
			visible,
			dialogTitle,
			displayContentItems,
			displayFlowRecords,
			actionChipColorMap,
			onVisibleChange,
			closeDialog
		};
	}
});

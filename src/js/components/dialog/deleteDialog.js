import { computed, defineComponent } from 'vue';

export default defineComponent({
	name: 'DeleteDialog',
	props: {
		modelValue: {
			type: Boolean,
			default: undefined
		},
		isVisiable: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: '確定要刪除？'
		},
		item: { type: String, default: '' },
		secItem: { type: String, default: '' },
		thrItem: { type: String, default: '' },
		confirmText: {
			type: String,
			default: '刪除'
		},
		cancelText: {
			type: String,
			default: '取消'
		},
		maxWidth: {
			type: String,
			default: '560px'
		},
		loading: {
			type: Boolean,
			default: false
		},
		persistent: {
			type: Boolean,
			default: true
		}
	},
	emits: [
		'update:modelValue',
		'submitDeleteDialog',
		'cancelDeleteDialog',
		'confirm',
		'cancel'
	],
	setup(props, { emit }) {
		const visible = computed(() => (props.modelValue ?? props.isVisiable));

		const onVisibleChange = (value) => {
			emit('update:modelValue', value);
			if (!value) {
				emit('cancelDeleteDialog');
				emit('cancel');
			}
		};

		const onCancel = () => {
			emit('update:modelValue', false);
			emit('cancelDeleteDialog');
			emit('cancel');
		};

		const onConfirm = () => {
			emit('submitDeleteDialog');
			emit('confirm');
		};

		return {
			visible,
			onVisibleChange,
			onCancel,
			onConfirm
		};
	}
});

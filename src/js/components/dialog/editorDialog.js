import { computed, defineComponent } from 'vue';

export default defineComponent({
	name: 'EditorDialog',
	props: {
		modelValue: {
			type: Boolean,
			default: undefined
		},
		isVisiable: {
			type: Boolean,
			default: false
		},
		maxWidth: {
			type: String,
			default: '900px'
		},
		height: {
			type: String,
			default: '65vh'
		},
		title: {
			type: String,
			default: '編輯資料'
		},
		titleMessage: {
			type: String,
			default: ''
		},
		submitIcon: {
			type: String,
			default: 'mdi-content-save'
		},
		submitString: {
			type: String,
			default: '儲存'
		},
		cancelIcon: {
			type: String,
			default: 'mdi-close'
		},
		cancelString: {
			type: String,
			default: '取消'
		},
		submitDisabled: {
			type: [Boolean, String, Array],
			default: true
		},
		submitLoading: {
			type: Boolean,
			default: false
		},
		persistent: {
			type: Boolean,
			default: true
		},
		submitOnCtrlEnter: {
			type: Boolean,
			default: true
		}
	},
	emits: [
		'update:modelValue',
		'submitEditorDialog',
		'cancelEditorDialog',
		'submit',
		'cancel'
	],
	setup(props, { emit }) {
		const visible = computed(() => (props.modelValue ?? props.isVisiable));

		const isSubmitEnabled = computed(() => {
			if(typeof props.submitDisabled === 'boolean')
				return props.submitDisabled;

			return Boolean(props.submitDisabled);
		});

		const handleScrollToTop = () => {
			const dialog = document.getElementById('editorDialog');
			if(dialog)
				dialog.scrollTop = 0;
		};

		const onVisibleChange = (value) => {
			emit('update:modelValue', value);
			if(!value)
				handleScrollToTop();
		};

		const onCancel = () => {
			handleScrollToTop();
			emit('update:modelValue', false);
			emit('cancelEditorDialog');
			emit('cancel');
		};

		const onSubmit = () => {
			if(!isSubmitEnabled.value)
				return;

			emit('submitEditorDialog');
			emit('submit');
		};

		return {
			visible,
			isSubmitEnabled,
			handleScrollToTop,
			onVisibleChange,
			onCancel,
			onSubmit
		};
	}
});

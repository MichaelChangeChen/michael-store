import { computed, defineComponent } from 'vue';

export default defineComponent({
	name: 'MessageDialog',
	props: {
		modelValue: {
			type: Boolean,
			default: undefined
		},
		isVisiable: {
			type: Boolean,
			default: false
		},
		item: {
			type: String,
			default: ''
		},
		maxWidth: {
			type: String,
			default: '480px'
		},
		maxHeight: {
			type: String,
			default: '75vh'
		},
		minHeight: {
			type: String,
			default: '10vh'
		},
		title: {
			type: String,
			default: '訊息'
		},
		titleMessage: {
			type: String,
			default: ''
		},
		html: {
			type: String,
			default: ''
		},
		persistent: {
			type: Boolean,
			default: true
		},
		showCopy: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:modelValue', 'closeMessage', 'close', 'copy'],
	setup(props, { emit }) {
		const visible = computed(() => (props.modelValue ?? props.isVisiable));

		const handleScrollToTop = () => {
			const dialog = document.getElementById('messageDialog');
			if (dialog) {
				dialog.scrollTop = 0;
			}
		};

		const onVisibleChange = (value) => {
			emit('update:modelValue', value);
			if (!value) {
				emit('closeMessage');
				emit('close');
				handleScrollToTop();
			}
		};

		const onClose = () => {
			emit('update:modelValue', false);
			emit('closeMessage');
			emit('close');
			handleScrollToTop();
		};

		const copyContent = async () => {
			const plain = [props.item, props.html].filter(Boolean).join('\n');
			if (!plain) {
				return;
			}

			try {
				await navigator.clipboard.writeText(plain);
				emit('copy', plain);
			} catch {
				emit('copy', plain);
			}
		};

		return {
			visible,
			handleScrollToTop,
			onVisibleChange,
			onClose,
			copyContent
		};
	}
});

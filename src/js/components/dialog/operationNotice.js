import { computed, defineComponent } from 'vue';

export default defineComponent({
	name: 'OperationNotice',
	props: {
		notice: {
			type: Object,
			required: true
		}
	},
	emits: ['close', 'action'],
	setup(props, { emit }) {
		const noticeIcon = computed(() => {
			if (props.notice.type === 'success') return 'mdi-check-circle';
			if (props.notice.type === 'warning') return 'mdi-alert';
			if (props.notice.type === 'error') return 'mdi-alert-circle';
			return 'mdi-information';
		});

		const noticeTitle = computed(() => {
			if (props.notice.title) return props.notice.title;
			if (props.notice.type === 'success') return 'Success';
			if (props.notice.type === 'warning') return 'Warning';
			if (props.notice.type === 'error') return 'Error';
			return 'Notice';
		});

		const emitClose = () => emit('close');

		const emitAction = () => {
			emit('action', props.notice);
			emitClose();
		};

		const onVisibleChange = (isVisible) => {
			if (!isVisible) {
				emitClose();
			}
		};

		return {
			emitClose,
			emitAction,
			noticeIcon,
			noticeTitle,
			onVisibleChange
		};
	}
});

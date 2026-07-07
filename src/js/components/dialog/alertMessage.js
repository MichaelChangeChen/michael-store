import { computed, defineComponent, ref, watch } from 'vue';

export default defineComponent({
	name: 'AlertMessage',
	props: {
		alertObj: {
			type: Object,
			required: true
		}
	},
	emits: ['close'],
	setup(props, { emit }) {
		const isOpen = ref(false);
		const alertMessage = ref('');
		const alertType = ref('info');
		const timeoutMs = ref(1600);

		const alertColor = computed(() => {
			if (alertType.value === 'success') return 'success';
			if (alertType.value === 'warning') return 'warning';
			if (alertType.value === 'error') return 'error';
			return 'info';
		});

		const alertIcon = computed(() => {
			if (alertType.value === 'success') return 'mdi-check-circle-outline';
			if (alertType.value === 'warning') return 'mdi-alert-outline';
			if (alertType.value === 'error') return 'mdi-alert-circle-outline';
			return 'mdi-information-outline';
		});

		const setAlert = (item) => {
			if (!item || !item.text) {
				return;
			}

			isOpen.value = true;
			alertMessage.value = item.text;
			alertType.value = item.status || 'info';
			timeoutMs.value = Number(item.timeout || 1600);
		};

		const closeAlert = () => {
			isOpen.value = false;
			emit('close');
		};

		const onVisibleChange = (value) => {
			isOpen.value = value;
			if (!value) {
				emit('close');
			}
		};

		watch(() => props.alertObj, (item) => {
			setAlert(item);
		}, { deep: true });

		return {
			isOpen,
			alertMessage,
			alertType,
			alertColor,
			alertIcon,
			timeoutMs,
			setAlert,
			closeAlert,
			onVisibleChange
		};
	}
});

import { computed, defineComponent } from 'vue';

export default defineComponent({
	name: 'FullPageDialog',
	props: {
		modelValue: {
			type: Boolean,
			default: false
		},
		persistent: {
			type: Boolean,
			default: true
		},
		transition: {
			type: String,
			default: 'dialog-bottom-transition'
		},
		height: {
			type: String,
			default: '100vh'
		},
		width: {
			type: String,
			default: '100%'
		}
	},
	emits: [
		'update:modelValue'
	],
	setup(props, { emit }) {
		const visible = computed(() => props.modelValue);

		const onCancel = () => {
			emit('update:modelValue', false);
		};

		return {
			visible,
			onCancel
		};
	}
});

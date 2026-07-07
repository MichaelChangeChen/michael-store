import { computed, defineComponent, toRefs } from 'vue';

const setTypeMap = {
	search: {
		color: 'teal-lighten-1',
		icon: 'mdi-magnify'
	},
	save: {
		color: 'primary',
		icon: 'mdi-content-save'
	},
	add: {
		color: 'indigo-darken-2',
		icon: 'mdi-plus'
	},
	edit: {
		color: 'info',
		icon: 'mdi-pencil-outline'
	},
	delete: {
		color: 'error',
		icon: 'mdi-trash-can-outline'
	},
	close: {
		color: 'warning',
		icon: 'mdi-close-circle'
	},
	cancel: {
		color: 'pink-lighten-2',
		icon: 'mdi-cancel'
	},
	notice: {
		color: 'orange-darken-2',
		icon: 'mdi-alert'
	},
	back: {
		color: 'secondary'
	},
	print: {
		color: 'teal-darken-3',
		icon: 'mdi-cloud-print-outline'
	},
	download: {
		color: 'teal',
		icon: 'mdi-download'
	},
	upload: {
		color: 'green-darken-3',
		icon: 'mdi-upload'
	},
	black: {
		color: 'black',
		icon: null
	},
	see: {
		color: 'primary',
		icon: 'mdi-eye-outline'
	}
};

export default defineComponent({
	name: 'BtnCompo',
	inheritAttrs: false,
	props: {
		name: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: 'button'
		},
		setType: {
			type: String,
			default: ''
		},
		variant: {
			type: String,
			default: 'tonal'
		},
		size: {
			type: String,
			default: 'small'
		},
		iconSize: {
			type: String,
			default: 'default'
		},
		styleType: {
			type: String,
			default: ''
		},
		setIcon: {
			type: String,
			default: ''
		},
		icon: {
			type: [String, Boolean],
			default: undefined
		},
		color: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		},
		loading: {
			type: [Boolean, String],
			default: false
		},
		block: {
			type: Boolean,
			default: false
		},
		tooltip: {
			type: String,
			default: ''
		},
		tooltipLocation: {
			type: String,
			default: 'bottom'
		}
	},
	setup(props) {
		const { tooltip, tooltipLocation } = toRefs(props);
		const resolvedSetType = computed(() => String(props.setType || props.styleType || '').trim().toLowerCase());
		const setTypeConfig = computed(() => setTypeMap[resolvedSetType.value] || {});
		const isIconButton = computed(() => (props.icon === true || typeof props.icon === 'string'));
		const resolvedIcon = computed(() => {
			if(props.setIcon === ' ')
				return null;
			if(props.setIcon)
				return props.setIcon;
			if(typeof props.icon === 'string' && props.icon === '')
				return setTypeConfig.value.icon || '';
			if(typeof props.icon === 'string')
				return props.icon;

			return setTypeConfig.value.icon || '';
		});

		const displayIconName = computed(() => resolvedIcon.value);
		const resolvedColor = computed(() => props.color || setTypeConfig.value.color || undefined);

		return {
			resolvedColor,
			displayIconName,
			isIconButton,
			tooltip,
			tooltipLocation,
		};
	}
});

import { computed, defineComponent, ref, watch, inject } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'

const colorProbeCache = new Map()

export default defineComponent({
	name: 'InputCompo',
	inheritAttrs: false,
	components: {
		VDateInput
	},
	props: {
		modelValue: {
			type: [String, Number, Boolean, Array, Object, null],
			default: ''
		},
		mode: {
			type: String,
			default: 'text',
			validator: (value) => ['text', 'textarea', 'select', 'combobox', 'file', 'checkbox', 'checkbox-group', 'radio-group'].includes(value)
		},
		type: {
			type: String,
			default: 'text'
		},
		class: {
			type: String,
			default: 'text'
		},
		label: {
			type: String,
			default: ''
		},
		placeholder: {
			type: String,
			default: ''
		},
		id: {
			type: String,
			default: ''
		},
		name: {
			type: String,
			default: ''
		},
		autocomplete: {
			type: String,
			default: ''
		},
		validateOn: {
			type: String,
			default: undefined
		},
		hint: {
			type: String,
			default: ''
		},
		message: {
			type: String,
			default: ''
		},
		messages: {
			type: [String, Array],
			default: () => []
		},
		errorMessages: {
			type: [String, Array],
			default: () => []
		},
		maxErrors: {
			type: [Number, String],
			default: 1
		},
		rules: {
			type: Array,
			default: () => []
		},
		variant: {
			type: String,
			default: 'outlined'
		},
		flat: {
			type: Boolean,
			default: false
		},
		singleLine: {
			type: Boolean,
			default: false
		},
		density: {
			type: String,
			default: 'compact'
		},
		rounded: {
			type: String,
			default: 'lg'
		},
		color: {
			type: String,
			default: 'primary'
		},
		baseColor: {
			type: String,
			default: 'blue-grey-lighten-2'
		},
		bgColor: {
			type: String,
			default: 'white'
		},
		hideDetails: {
			type: [Boolean, String],
			default: 'auto'
		},
		clearable: {
			type: Boolean,
			default: false
		},
		clearIcon: {
			type: String,
			default: '$clear'
		},
		readonly: {
			type: Boolean,
			default: undefined
		},
		disabled: {
			type: Boolean,
			default: null
		},
		required: {
			type: Boolean,
			default: false
		},
		persistentHint: {
			type: Boolean,
			default: false
		},
		persistentPlaceholder: {
			type: Boolean,
			default: false
		},
		loading: {
			type: [Boolean, String],
			default: false
		},
		error: {
			type: Boolean,
			default: false
		},
		rows: {
			type: [String, Number],
			default: 3
		},
		maxRows: {
			type: [String, Number],
			default: undefined
		},
		autoGrow: {
			type: Boolean,
			default: false
		},
		counter: {
			type: [Boolean, Number, String],
			default: false
		},
		prependInnerIcon: {
			type: String,
			default: ''
		},
		appendInnerIcon: {
			type: String,
			default: ''
		},
		prependIcon: {
			type: String,
			default: ''
		},
		appendIcon: {
			type: String,
			default: ''
		},
		prefix: {
			type: String,
			default: ''
		},
		suffix: {
			type: String,
			default: ''
		},
		min: {
			type: [String, Number],
			default: undefined
		},
		max: {
			type: [String, Number],
			default: undefined
		},
		step: {
			type: [String, Number],
			default: undefined
		},
		minLength: {
			type: [String, Number],
			default: undefined
		},
		maxLength: {
			type: [String, Number],
			default: undefined
		},
		items: {
			type: Array,
			default: () => []
		},
		itemTitle: {
			type: String,
			default: 'title'
		},
		itemValue: {
			type: String,
			default: 'value'
		},
		multiple: {
			type: Boolean,
			default: false
		},
		chips: {
			type: Boolean,
			default: false
		},
		closableChips: {
			type: Boolean,
			default: false
		},
		menuIcon: {
			type: String,
			default: 'mdi-menu-down'
		},
		menuProps: {
			type: [String, Array, Object],
			default: undefined
		},
		noDataText: {
			type: String,
			default: undefined
		},
		returnObject: {
			type: Boolean,
			default: false
		},
		hideNoData: {
			type: Boolean,
			default: false
		},
		noFilter: {
			type: Boolean,
			default: false
		},
		itemProps: {
			type: [Boolean, String, Function],
			default: undefined
		},
		filterKeys: {
			type: [Array, String],
			default: undefined
		},
		customFilter: {
			type: Function,
			default: undefined
		},
		openOnClear: {
			type: Boolean,
			default: false
		},
		inline: {
			type: Boolean,
			default: false
		},
		value: {
			type: [String, Number, Boolean, Object, null],
			default: true
		},
		trueValue: {
			type: [String, Number, Boolean, Object],
			default: true
		},
		falseValue: {
			type: [String, Number, Boolean, Object],
			default: false
		},
		isRowInput: {
			type: Boolean,
			default: false
		},
		noBgc: {
			type: Boolean,
			default: false
		},
		sanitize: {
			type: Boolean,
			default: false
		}
	},
	emits: [
		'blur',
		'input',
		'clear',
		'focus',
		'keyupEnter',
		'clickAppend',
		'click:clear',
		'update:focused',
		'update:modelValue',
		'click:append-inner',
	],
	setup(props, { emit }) {
		const	formatDateToYmd = (value) => {
					if(!value)
						return '';

					if(typeof value === 'string') {
						const normalized = value.trim().replace(/\//g, '-');
						if(!normalized)
							return '';

						if(/^\d{4}-\d{2}-\d{2}$/.test(normalized))
							return normalized;

						const parsedFromString = new Date(normalized);

						if(Number.isNaN(parsedFromString.getTime()))
							return '';

						const 	year = parsedFromString.getFullYear(),
								month = String(parsedFromString.getMonth() + 1).padStart(2, '0'),
								day = String(parsedFromString.getDate()).padStart(2, '0');

						return `${year}-${month}-${day}`;
					};

					const parsed = value instanceof Date ? value : new Date(value)

					if(Number.isNaN(parsed.getTime()))
						return '';

					const 	year = parsed.getFullYear(),
							month = String(parsed.getMonth() + 1).padStart(2, '0'),
							day = String(parsed.getDate()).padStart(2, '0');

					return `${year}-${month}-${day}`;
				},
				parseYmdToDate = (value) => {
					if (!value || typeof value !== 'string') {
						return null
					}

					const normalized = formatDateToYmd(value)
					if (!normalized) {
						return null
					}

					const parsed = new Date(`${normalized}T00:00:00`)
					return Number.isNaN(parsed.getTime()) ? null : parsed
				},
				formatTimeToHm = (value) => {
					if(!value)
						return '';

					if(typeof value === 'string') {
						const time = value.trim().slice(0, 5);
						return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time) ? time : '';
					}

					if(value instanceof Date && !Number.isNaN(value.getTime())) {
						const hours = String(value.getHours()).padStart(2, '0');
						const minutes = String(value.getMinutes()).padStart(2, '0');
						return `${hours}:${minutes}`;
					}

					return '';
				},
				parseDateTimeParts = (value) => {
					if(!value || typeof value !== 'string')
						return { date: '', time: '' };

					const normalized = value.replace(' ', 'T');
					const [datePart = '', timePart = ''] = normalized.split('T');
					const date = formatDateToYmd(datePart);
					const time = formatTimeToHm(timePart);
					return { date, time };
				},
				combineDateTime = (date, time) => {
					const normalizedDate = formatDateToYmd(date);
					if(!normalizedDate)
						return '';

					const normalizedTime = formatTimeToHm(time) || '00:00';
					return `${normalizedDate}T${normalizedTime}`;
				},
				getNormalizedValue = (value) => {
					if (props.mode === 'checkbox-group') {
						return Array.isArray(value) ? value : []
					}
					return value
				}

		const localValue = ref(getNormalizedValue(props.modelValue))
		const className = computed(() => props.class)


		watch(
			() => props.modelValue,
			(value) => {
				const normalizedValue = getNormalizedValue(value)
				if (normalizedValue !== localValue.value) {
					localValue.value = normalizedValue
				}
			}
		)

		watch(localValue, (value) => {
			let nextValue = value

			if(props.sanitize && typeof nextValue === 'string') {
				nextValue = nextValue.replace(/['"=<>]/g, '');
				if (nextValue !== value) {
					localValue.value = nextValue;
					return;
				}
			};

			emit('update:modelValue', nextValue);
			emit('input', nextValue);
		});

		watch(
			() => props.mode,
			() => {
				localValue.value = getNormalizedValue(localValue.value)
			}
		)

		const isFileInput = computed(() => props.mode === 'file' || props.type === 'file')

		const form = inject(Symbol.for('vuetify:form'), null);
		const isReadonly = computed(() => form?.isReadonly.falseValue)


		const inputTag = computed(() => {
			if (props.mode === 'select') {
				return 'v-select'
			}
			if (props.mode === 'combobox') {
				return 'v-combobox'
			}
			if (props.mode === 'textarea') {
				return 'v-textarea'
			}
			return 'v-text-field'
		})


		const dateInputDisplayFormat = (value) => formatDateToYmd(value)

		const datePickerValue = computed({
			get: () => parseYmdToDate(localValue.value),
			set: (value) => {
				localValue.value = formatDateToYmd(value)
			}
		}),
		timeOptions = computed(() => {
			const options = []

			for(let hour = 0; hour < 24; hour += 1) {
				for(let minute = 0; minute < 60; minute += 30) {
					const h = String(hour).padStart(2, '0');
					const m = String(minute).padStart(2, '0');
					options.push(`${h}:${m}`);
				}
			}

			return options
		}),
		dateTimeDateValue = computed({
			get: () => parseYmdToDate(parseDateTimeParts(localValue.value).date),
			set: (value) => {
				const { time } = parseDateTimeParts(localValue.value);
				localValue.value = combineDateTime(formatDateToYmd(value), time);
			}
		}),
		dateTimeTimeValue = computed({
			get: () => parseDateTimeParts(localValue.value).time,
			set: (value) => {
				const { date } = parseDateTimeParts(localValue.value);
				localValue.value = combineDateTime(	date || formatDateToYmd(new Date()),
													formatTimeToHm(value));
			}
		}),
		normalizedItems = computed(() => props.items.map((item) => {
			if(typeof item === 'object' && item !== null)
				return {
					label: item[props.itemTitle] ?? item.itemValue ?? item,
					value: item[props.itemValue] ?? item,
					disabled: Boolean(item.disabled)
				};

			return {
				label: String(item),
				value: item,
				disabled: false,
			};
		}))

		const isCssColor = (value) => /^(#|rgb\(|rgba\(|hsl\(|hsla\(|var\()/.test(String(value || '').trim())
		const resolvedColor = ref('')
		const resolveVuetifyColor = (value) => {
			if (colorProbeCache.has(value)) {
				return colorProbeCache.get(value)
			}

			if (typeof document === 'undefined') {
				return ''
			}

			const probe = document.createElement('span')
			probe.className = `text-${value}`
			probe.style.position = 'absolute'
			probe.style.left = '-9999px'
			probe.style.top = '-9999px'
			probe.style.visibility = 'hidden'
			probe.style.pointerEvents = 'none'
			probe.textContent = '.'
			document.body.appendChild(probe)
			const color = getComputedStyle(probe).color
			document.body.removeChild(probe)
			colorProbeCache.set(value, color)
			return color
		}

		const syncBaseColor = () => {
			const color = String(props.color || '').trim();

			if(!color)
				return resolvedColor.value = '';

			if(isCssColor(color))
				return resolvedColor.value = color;

			const resolved = resolveVuetifyColor(color);
			resolvedColor.value = resolved || `rgb(var(--v-theme-${color}))`;
		};

		watch(() => props.color, syncBaseColor, { immediate: true })

		const groupStyle = computed(() => ({
			'--input-group-focus-color': resolvedColor.value
		}))

		const displayLabel = computed(() => {
			if (!props.label) {
				return ''
			}
			return props.label
		})

		const resolvedHideDetails = computed(() => {
			if (props.required && props.hideDetails === true) {
				return false
			}
			return props.hideDetails
		})

		const wrapperClass = computed(() => ({
			'input-compo--required': props.required && !props.disabled,
			'input-compo--row': props.isRowInput,
			'input-compo--no-bgc': props.noBgc
		}))


		const onClear = (event) => {
			emit('click:clear', event)
			emit('clear')
		}

		const onClickAppend = (event) => {
			emit('click:append-inner', event)
			emit('clickAppend')
		}

		const onFocus = (event) => emit('focus', event)
		const onBlur = (event) => emit('blur', event)
		const onUpdateFocused = (value) => emit('update:focused', value)
		const checkRadioValue = (value) => {
			console.log(value);

			if(['Y', 'y', true].includes(value))
				return '是';
			else if(['N', 'n', false].includes(value))
				return '否';
		};

		return {
			isReadonly,
			localValue,
			isFileInput,
			inputTag,
			className,
			datePickerValue,
			checkRadioValue,
			dateInputDisplayFormat,
			dateTimeDateValue,
			dateTimeTimeValue,
			timeOptions,
			normalizedItems,
			groupStyle,
			displayLabel,
			resolvedHideDetails,
			wrapperClass,
			onClear,
			onClickAppend,
			onFocus,
			onBlur,
			onUpdateFocused
		}
	}
})

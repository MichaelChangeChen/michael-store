import { defineComponent, ref, watch } from 'vue';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn.js';

export default defineComponent({
	name: 'CKEditorCompo',
	components: {
		CKEditor: CKEditor.component
	},
	props: {
		modelValue: {
			type: String,
			default: ''
		},
		textValue: {
			type: String,
			default: ''
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	emits: ['update:modelValue', 'input', 'ready', 'focus', 'blur', 'destroy'],
	setup(props, { emit }) {
		const editor = ClassicEditor;
		const setValue = ref(props.modelValue || props.textValue || '');
		const editorConfig = {
			language: 'zh-cn',
			toolbar: [
				'heading', '|',
				'undo', 'redo', '|',
				'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
				'outdent', 'indent', '|',
				'blockQuote', 'insertTable'
			],
			table: {
				contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
			}
		};

		const syncValue = (value) => {
			setValue.value = value || '';
		};

		const handleInput = (value) => {
			emit('update:modelValue', value);
			emit('input', value);
		};

		const handleReady = (value) => {
			emit('ready', value);
		};

		const handleFocus = (value) => {
			emit('focus', value);
		};

		const handleBlur = (value) => {
			emit('blur', value);
		};

		const handleDestroy = (value) => {
			emit('destroy', value);
		};

		watch(() => props.modelValue, syncValue);
		watch(() => props.textValue, (value) => {
			if(!props.modelValue)
				syncValue(value);
		});

		return {
			editor,
			setValue,
			editorConfig,
			handleInput,
			handleReady,
			handleFocus,
			handleBlur,
			handleDestroy
		};
	}
});

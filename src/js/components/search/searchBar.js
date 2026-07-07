import { defineComponent, watch } from 'vue';

export default defineComponent({
	props: {
		isVisiable: {
			type: Boolean,
			default: false,
		}
	},
	emits: ['closeSearchBar', 'submitSearchBar', 'resetSearchBar'],
	setup(props, { emit }) {
		watch(() => props.isVisiable, (status) => {
			if(status)
				document.documentElement.classList.add('overflow-y-hidden');
			else
				document.documentElement.classList.remove('overflow-y-hidden');
		});

		const handleOutsideClick = (e) => {
			if(e.target?.classList?.contains('search-mask-open'))
				emit('closeSearchBar');
		};

		return {
			handleOutsideClick
		};
	}
});

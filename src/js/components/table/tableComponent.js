import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
	props: {
		hasHeader: {
			type: Boolean,
			default: false
		},
		oneRow: {
			type: Boolean,
			default: false
		},
		noScrollY: {
			type: Boolean,
			default: true
		},
		isAssistiveBar: {
			type: Boolean,
			default: false
		}
	},
	setup(props) {
		const tableWrapper = ref(null);
		const animationFrameId = ref(null);
		const isAssistiveBar = ref(props.isAssistiveBar);

		onMounted(() => {
			const table = window.document.querySelector('.table-component');
			if(table)
				tableWrapper.value = table.querySelector('.v-data-table__wrapper');
		});

		const overAssistiveBar = (side) => {
			if(!tableWrapper.value)
				return;

			const maxWidth = tableWrapper.value.scrollWidth - tableWrapper.value.clientWidth;
			const scrollSpeed = 15;

			if(tableWrapper.value.scrollWidth > tableWrapper.value.clientWidth)
				isAssistiveBar.value = true;

			const step = () => {
				if(side === 'left')
					tableWrapper.value.scrollLeft -= scrollSpeed;

				if(side === 'right')
					tableWrapper.value.scrollLeft += scrollSpeed;

				if(tableWrapper.value.scrollLeft < maxWidth)
					animationFrameId.value = requestAnimationFrame(step);

				if(tableWrapper.value.scrollLeft >= maxWidth || tableWrapper.value.scrollLeft <= 0)
					cancelAnimationFrame(animationFrameId.value);
			};

			animationFrameId.value = requestAnimationFrame(step);
		};

		const outAssistiveBar = () => {
			cancelAnimationFrame(animationFrameId.value);
		};

		return {
			isAssistiveBar,
			overAssistiveBar,
			outAssistiveBar
		};
	}
});

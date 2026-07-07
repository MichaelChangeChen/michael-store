
export default {
	props: {
		value: {
			type: Array,
			default: () => []
		},
	},
	data () {
		return {
			treeList: []
		}
	},
	watch: {
		value (newValue) {
			this.treeList = newValue;
		},
		treeList (newValue) {
			this.$emit(	'input',
						newValue);
		}
	}
}

import { computed, defineComponent } from 'vue';

export default defineComponent({
	name: 'EipSidebarRailItem',
	props: {
		item: {
			type: Object,
			default: () => ({})
		},
		level: {
			type: Number,
			default: 0
		},
		routePath: {
			type: String,
			default: ''
		},
		expandedGroupIds: {
			type: Array,
			default: () => []
		},
		isGroupViewOpen: {
			type: Boolean,
			default: false
		},
		toggleGroup: {
			type: Function,
			default: () => {}
		},
		nodeKey: {
			type: String,
			default: ''
		}
	},
	setup(props) {
		const isLink = computed(() => Boolean(props.item?.link));
		const itemClass = computed(() =>
			props.level > 0 ? 'eip-sidebar__nav-item--child' : ''
		);
		const hasActiveChild = item =>
			(item?.items || []).some(child => {
				if(child?.link && (props.routePath === child.link || props.routePath.startsWith(`${child.link}/`)))
					return true;

				return hasActiveChild(child);
			});
		const isActive = computed(() => hasActiveChild(props.item));
		const isExpanded = computed(() => {
			if(isLink.value || !props.isGroupViewOpen)
				return false;

			if(props.expandedGroupIds.includes(props.nodeKey))
				return true;

			return isActive.value;
		});

		return {
			isLink,
			itemClass,
			isActive,
			isExpanded
		};
	}
});
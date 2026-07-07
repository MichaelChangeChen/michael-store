<template>
	<RouterLink
		v-if="isLink && !item.disabled"
		:to="item.link"
		:class="[ 'eip-sidebar__nav-item', itemClass ]">
		<v-icon>{{ item.icon }}</v-icon>
		<span class="eip-sidebar__label">{{ item.text }}</span>
	</RouterLink>
	<div
		v-else-if="isLink && item.disabled"
		:class="[ 'eip-sidebar__nav-item', itemClass, 'eip-sidebar__nav-item--disabled' ]"
		aria-disabled="true">
		<v-icon>{{ item.icon }}</v-icon>
		<span class="eip-sidebar__label">{{ item.text }}</span>
	</div>
	<div v-else class="eip-sidebar__group">
		<button
			type="button"
			:class="[
				'eip-sidebar__nav-item',
				'eip-sidebar__nav-item--group',
				itemClass,
				{
					'is-active': isActive,
					'is-open': isExpanded
				}
			]"
			:aria-expanded="isExpanded"
			@click="toggleGroup(nodeKey)">
			<v-icon>{{ item.icon }}</v-icon>
			<span class="eip-sidebar__label">{{ item.text }}</span>
			<v-icon class="eip-sidebar__group-chevron">mdi-chevron-down</v-icon>
		</button>
		<div v-show="isExpanded" class="eip-sidebar__subnav">
			<EipSidebarRailItem
				v-for="(child, index) in item.items || []"
				:key="child.link || `${nodeKey}-${index}`"
				:item="child"
				:level="level + 1"
				:route-path="routePath"
				:expanded-group-ids="expandedGroupIds"
				:is-group-view-open="isGroupViewOpen"
				:toggle-group="toggleGroup"
				:node-key="`${nodeKey}-${index}`" />
		</div>
	</div>
</template>

<script src="@/js/layout/components/eipSidebarRailItem.js"/>
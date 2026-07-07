<template>
	<div class="datatable-component" ref="datatableRoot">
		<div
			v-if="isAssistiveBar"
			@mouseenter="overAssistiveBar('left')"
			@mouseleave="outAssistiveBar"
			class="left-assistive-bar" />
		<v-data-table
			v-model="selectedRows"
			:headers="normalizedHeaders"
			:items="items"
			:item-value="resolvedItemValue"
			:items-length="resolvedItemsLength"
			:loading="loading"
			:search="search"
			:show-select="isShowSelect"
			:hide-default-footer="hideFooter"
			:fixed-header="fixedHeader"
			:height="fixedHeader ? tableHeight : undefined"
			:page="page"
			:items-per-page="itemsPerPage"
			:sort-by="sortBy"
			:items-per-page-options="resolvedItemsPerPageOptions"
			:no-data-text="noDataText"
			:class="['datatable', { 'mb-3': hideFooter }]"
			:page-text="`共 ${totalCount} 筆資料，全部 ${maxPage} 頁，目前第 ${currentPage} 頁`"
			@update:options="onUpdateOptions"
			@update:page="onUpdatePage"
			@update:items-per-page="onUpdateItemsPerPage"
			@update:sort-by="onUpdateSortBy"
			items-per-page-text="每頁行數">
			<template #header.data-table-select="{ allSelected, someSelected, selectAll }">
				<div class="d-flex align-center ga-2">
					<v-checkbox-btn
						:model-value="allSelected"
						:indeterminate="someSelected && !allSelected"
						@update:model-value="selectAllRows(selectAll, $event)"
						density="compact" />
					<span v-if="setHeader">{{ setHeader }}</span>
				</div>
			</template>
			<template #item.data-table-select="slotProps">
				<slot
					name="data-table-select"
					:item="getRow(slotProps.item)"
					:index="slotProps.index"
					:isSelected="Boolean(slotProps.props?.modelValue)"
					:select="(value) => selectRow(slotProps, value)">
					<v-checkbox-btn
						:model-value="Boolean(slotProps.props?.modelValue)"
						:disabled="slotProps.props?.disabled"
						@click.stop="selectRow(slotProps)"
						density="compact" />
				</slot>
			</template>
			<template
				v-for="header in bodyHeaders"
				:key="header.key"
				v-slot:[`item.${header.key}`]="slotProps">
				<div v-if="header.key === 'btns'" class="button-group-center">
					<slot
						name="btns"
						:item="getRow(slotProps.item)"
						:index="slotProps.index" />
				</div>
				<slot
					v-else
					:name="header.key"
					:item="getRow(slotProps.item)"
					:value="slotProps.value"
					:index="slotProps.index">
					{{ formatCell(getRow(slotProps.item), header.key) }}
				</slot>
			</template>
		</v-data-table>
		<div
			v-if="isAssistiveBar"
			@mouseenter="overAssistiveBar('right')"
			@mouseleave="outAssistiveBar"
			class="right-assistive-bar" />
	</div>
</template>

<script src="@/js/components/table/datatableComponent.js"/>
<style lang="scss" scoped>
	@import "@/css/components/table/datatable-component.scss";
</style>

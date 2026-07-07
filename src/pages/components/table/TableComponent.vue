<template>
	<div :class="[ 'table-img-box', { 'stretch': isAssistiveBar } ]">
		<div
			v-if="isAssistiveBar"
			@mouseenter="overAssistiveBar('left')"
			@mouseleave="outAssistiveBar('left')"
			class="left-assistive-bar">
		</div>
		<v-simple-table :class="['table-component', {'noScrollY': noScrollY}]">
			<!-- 沒 header -->
			<tbody v-if="!hasHeader" :class="[ 'td-in-row', { 'row-1': oneRow }]">
				<slot></slot>
			</tbody>
			<!-- 有 header -->
			<template v-if="hasHeader">
				<slot></slot>
			</template>
		</v-simple-table>
		<div
			v-if="isAssistiveBar"
			@mouseenter="overAssistiveBar('right')"
			@mouseleave="outAssistiveBar('right')"
			class="right-assistive-bar">
		</div>
	</div>
</template>

<script src="@/js/components/table/tableComponent.js"></script>

<style lang="scss">
	@import "@/css/components/table/table-component.scss";
</style>
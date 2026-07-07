<template>
	<v-tooltip
		v-if="tooltip"
		:text="tooltip"
		:location="tooltipLocation">
		<template #activator="{ props: tooltipProps }">
			<v-btn
				v-bind="{ ...$attrs, ...tooltipProps }"
				:type="type"
				:variant="variant"
				:size="size"
				:color="resolvedColor"
				:icon="isIconButton"
				:disabled="disabled"
				:loading="loading"
				:block="block">
				<div :class="name ? 'd-flex align-center ga-1' : ''">
					<v-icon
						v-if="displayIconName"
						:size="iconSize"
						:icon="displayIconName"/>
					{{ name }}
				</div>
				<slot />
			</v-btn>
		</template>
	</v-tooltip>
	<v-btn
		v-else
		v-bind="$attrs"
		:type="type"
		:variant="variant"
		:size="size"
		:color="resolvedColor"
		:icon="isIconButton"
		:disabled="disabled"
		:loading="loading"
		:block="block">
		<div :class="name ? 'd-flex align-center ga-1' : ''">
			<v-icon
				v-if="displayIconName"
				:size="iconSize"
				:icon="displayIconName"/>
			{{ name }}
		</div>
		<slot />
	</v-btn>
</template>

<script src="@/js/components/btn/btnCompo.js"/>

<style lang="scss" scoped>
	@import '@/css/components/btn/btn-compo.scss';
</style>

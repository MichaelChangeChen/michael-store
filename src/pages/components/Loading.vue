<template>
	<div>
		<v-overlay
			height="100%"
			width="100%"
			content-class="d-flex flex-column justify-center align-center ga-4"
			model-value
			persistent
			disabled>
			<!-- <v-progress-circular
				color="white"
				indeterminate
				size="150"
				width="10"/> -->
			<h1 class="text-center text-white text user-select-none">
				讀取中請稍後...
				<v-progress-linear
					height="6"
					color="white"
					bg-color="black"
					indeterminate
					rounded-bar
					rounded />
			</h1>
		</v-overlay>
	</div>
</template>

<style scoped lang="scss">
@import '@/css/components/loading.scss';
</style>

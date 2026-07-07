<template>
	<v-snackbar
		:model-value="isOpen"
		:timeout="timeoutMs"
		@update:model-value="onVisibleChange"
		variant="tonal"
		location="bottom end"
		class="alert-message">
		<div class="alert-message__content">
			<v-icon
				:icon="alertIcon"
				:color="alertColor"
				class="mr-2" />
			<span>{{ alertMessage }}</span>
		</div>
		<template #actions>
			<BtnCompo
				@click="closeAlert"
				variant="tonal"
				icon="mdi-close" />
		</template>
	</v-snackbar>
</template>

<script src="@/js/components/dialog/alertMessage.js"/>
<style scoped lang="scss">
@import '@/css/components/dialog/alert-message.scss';
</style>

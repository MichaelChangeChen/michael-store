<template>
	<v-dialog
		:model-value="visible"
		:persistent="persistent"
		:transition="transition"
		:height="height"
		:width="width"
		content-class="full-page-dialog"
		scrollable>
		<v-card class="full-page-dialog__card" rounded="100">
			<v-card-title class="text-end pa-0">
				<BtnCompo
					@click="onCancel"
					setType="close"
					icon="mdi-close"
					variant="text"
					size="small"
					tooltip="關閉" />
			</v-card-title>
			<v-card-text class="full-page-dialog__body pa-0">
				<div class="px-8 py-4 full-page-dialog__content print-area">
					<slot />
				</div>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script src="@/js/components/dialog/fullPageDialog.js"/>
<style lang="scss">
	@import '@/css/components/dialog/full-page-dialog.scss';
</style>
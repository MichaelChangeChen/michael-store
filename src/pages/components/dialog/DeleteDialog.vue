<template>
	<v-dialog
		:model-value="visible"
		:max-width="maxWidth"
		:persistent="persistent"
		@update:model-value="onVisibleChange"
		content-class="delete-dialog"
		transition="dialog-top-transition">
		<v-card rounded="lg">
			<v-card-title class="d-flex align-center ga-2">
				<v-icon icon="mdi-alert-circle-outline" color="red-lighten-1" />
				<strong>{{ title }}</strong>
			</v-card-title>
			<v-divider />
			<v-card-text>
				<p class="delete-dialog__hint mb-4">此操作無法復原，請確認是否繼續。</p>
				<ul class="delete-dialog__list">
					<li v-if="item">{{ item }}</li>
					<li v-if="secItem">{{ secItem }}</li>
					<li v-if="thrItem">{{ thrItem }}</li>
				</ul>
			</v-card-text>
			<v-divider />
			<v-card-actions class="justify-end pa-4">
				<BtnCompo
					:loading="loading"
					@click="onConfirm"
					variant="elevated"
					color="red-lighten-1">
					{{ confirmText }}
				</BtnCompo>
				<BtnCompo
					:disabled="loading"
					@click="onCancel"
					color="primary">
					{{ cancelText }}
				</BtnCompo>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script src="@/js/components/dialog/deleteDialog.js"/>
<style lang="scss">
	@import '@/css/components/dialog/delete-dialog.scss';
</style>


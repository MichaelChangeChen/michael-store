<template>
	<v-dialog
		:model-value="visible"
		:max-width="maxWidth"
		:persistent="persistent"
		@update:model-value="onVisibleChange"
		content-class="message-dialog"
		transition="dialog-top-transition">
		<v-card rounded="lg">
			<v-card-title class="d-flex justify-space-between align-center ga-2">
				<div>
					<div class="text-h6 font-weight-bold">{{ title }}</div>
					<div v-if="titleMessage" class="message-dialog__subtitle">{{ titleMessage }}</div>
				</div>
				<BtnCompo
					@click="onClose"
					icon="mdi-close"
					variant="text"
					color="red"
					size="x-small" />
			</v-card-title>
			<v-divider />
			<v-card-text :style="{ minHeight, maxHeight }" class="overflow-auto">
				<div id="messageDialog" class="message-dialog__content">
					<slot>
						<div class="message-dialog__item">
							{{ item }}
							<div
								v-if="html"
								v-html="html"
								class="mt-2"/>
						</div>
					</slot>
				</div>
			</v-card-text>
			<v-divider />
			<v-card-actions class="justify-space-between pa-4">
				<BtnCompo
					v-if="showCopy"
					@click="copyContent"
					variant="tonal"
					prepend-icon="mdi-content-copy">
					複製內容
				</BtnCompo>
				<div class="ml-auto">
					<BtnCompo
						@click="onClose"
						color="pink"
						variant="tonal"
						size="small">
						關閉
					</BtnCompo>
				</div>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script src="@/js/components/dialog/messageDialog.js"/>
<style lang="scss">
	@import '@/css/components/dialog/message-dialog.scss';
</style>

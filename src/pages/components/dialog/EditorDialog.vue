<template>
	<v-dialog
		:model-value="visible"
		:max-width="maxWidth"
		max-height="80vh"
		:persistent="persistent"
		@update:model-value="onVisibleChange"
		content-class="editor-dialog"
		eager>
		<v-card
			:style="{ maxHeight: `calc(${height} - 48px)` }"
			class="editor-dialog__card"
			rounded="lg">
			<v-card-title class="d-flex justify-space-between align-center ga-2">
				<div>
					<div class="text-h6 font-weight-bold">{{ title }}</div>
					<div v-if="titleMessage" class="editor-dialog__subtitle">{{ titleMessage }}</div>
				</div>
				<BtnCompo
					@click="onCancel"
					icon="mdi-close"
					variant="text"
					color="red"
					size="x-small" />
			</v-card-title>
			<v-divider />
			<v-card-text
				@keydown.ctrl.enter="submitOnCtrlEnter && onSubmit()"
				class="editor-dialog__body pa-0">
				<div id="editorDialog" class="editor-dialog__scroll">
					<slot/>
				</div>
			</v-card-text>
			<v-divider />
			<v-card-actions class="justify-end pa-4 ga-2">
				<template v-if="$slots.actions">
					<slot name="actions"/>
				</template>
				<template v-else>
					<slot name="addBtn"/>
					<BtnCompo
						:prepend-icon="submitIcon"
						:disabled="!isSubmitEnabled"
						:loading="submitLoading"
						@click="onSubmit"
						color="primary"
						variant="tonal"
						size="small">
						{{ submitString }}
					</BtnCompo>
					<BtnCompo
						:prepend-icon="cancelIcon"
						@click="onCancel"
						color="pink"
						variant="tonal"
						size="small">
						{{ cancelString }}
					</BtnCompo>
				</template>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script src="@/js/components/dialog/editorDialog.js"/>
<style lang="scss">
	@import '@/css/components/dialog/editor-dialog.scss';
</style>

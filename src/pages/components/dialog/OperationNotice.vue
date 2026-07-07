<template>
	<v-snackbar
		:model-value="notice.isOpen"
		:timeout="notice.timeout"
		:close-on-content-click="false"
		:class="['operation-notice', `notice-${notice.type || 'info'}`]"
		@update:model-value="onVisibleChange"
		location="bottom end"
		rounded="pill">
		<div class="notice-content">
			<div class="notice-icon-wrap">
				<v-icon :icon="noticeIcon" class="notice-icon" />
			</div>
			<div class="notice-text-wrap">
				<div class="notice-title">{{ noticeTitle }}</div>
				<div class="notice-text">{{ notice.text }}</div>
			</div>
		</div>
		<template #actions>
			<BtnCompo
				v-if="notice.actionLabel"
				:name="notice.actionLabel"
				@click="emitAction"
				class="action-btn" />
			<BtnCompo
				@click="emitClose"
				icon="mdi-close"
				class="close-btn"/>
		</template>
	</v-snackbar>
</template>

<script src="@/js/components/dialog/operationNotice.js"/>

<style scoped lang="scss">
@import '@/css/components/dialog/operation-notice.scss';
</style>

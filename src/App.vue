<template>
	<div>
		<v-app>
			<transition name="fade" mode="out-in">
				<component :is="currentLayout">
					<router-view :key="route.name"/>
				</component>
			</transition>
		</v-app>
		<Loading v-if="isLoading" />
		<OperationNotice :notice="notice" @close="hideNotice" />
	</div>
</template>

<script src="@/js/app.js"/>
<style lang="scss">
	@import '@/css/app.scss';
</style>

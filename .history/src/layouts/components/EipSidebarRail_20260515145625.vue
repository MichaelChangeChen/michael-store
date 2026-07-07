<template>
	<div class="eip-sidebar-rail">
		<v-navigation-drawer
			v-model="drawerOpen"
			:class="['border-0', { 'is-mobile': isMobile, 'radius': showLogout }]"
			:expand-on-hover="!isMobile"
			:permanent="!isMobile"
			:temporary="isMobile"
			:rail="!isMobile"
			:scrim="isMobile"
			@update:rail="onRailUpdate"
			@mouseenter="onHoverIn"
			@mouseleave="onHoverOut"
			width="280">
			<aside class="eip-sidebar">
				<BtnCompo
					v-if="isMobile"
					@click="emit('update:modelValue', false)"
					icon="mdi-close"
					variant="text"
					class="align-center align-self-end mr-2" />
				<div class="eip-sidebar__brand">
					<!-- <img
						class="eip-sidebar__logo"
						src="@/assets/logo.svg"
						alt="EIP" /> -->
					<div class="eip-sidebar__brand-text">
						<h1 class="eip-sidebar__title">個人資料保護委員會籌備處</h1>
						<span class="eip-sidebar__badge">員工入口網</span>
					</div>
				</div>
				<nav :class="['eip-sidebar__nav', { 'scroll-y-auto': showLogout} ]">
					<EipSidebarRailItem
						v-for="(item, index) in navItems"
						:key="item.link || `${item.text}-${index}`"
						:item="item"
						:route-path="routePath"
						:expanded-group-ids="expandedGroupIds"
						:is-group-view-open="isGroupViewOpen"
						:toggle-group="toggleGroup"
						:node-key="`${item.text}-${index}`" />
				</nav>
				<div class="eip-sidebar__footer">
					<BtnCompo
						@click="handleLogout"
						:size="!showLogout ? 'x-small' : 'small'"
						class="eip-sidebar__cta"
						variant="tonal">
						<v-icon>mdi-logout</v-icon>
						<span v-show="showLogout" class="eip-sidebar__label">登出</span>
					</BtnCompo>
				</div>
			</aside>
		</v-navigation-drawer>
	</div>
</template>

<script src="@/js/eip/components/eipSidebarRail.js"/>

<style lang="scss">
	@import '@/css/eip/components/eip-sidebar-rail.scss';
</style>

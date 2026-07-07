<template>
	<v-layout class="main-layout fill-height">
		<v-navigation-drawer
			v-model="drawer"
			:class="['main-layout__drawer', { 'main-layout__drawer--rail': rail && !isMobile, 'is-expanded': showSidebarContent }]"
			:permanent="!isMobile"
			:temporary="isMobile"
			:rail="rail && !isMobile"
			:scrim="isMobile"
			width="280">
			<aside class="eip-sidebar">
				<div class="eip-sidebar__brand">
					<div class="eip-sidebar__brand-text">
						<h1 class="eip-sidebar__title">Michael Store</h1>
						<span class="eip-sidebar__badge">買你所想買　×　玩你所想玩</span>
					</div>
				</div>
				<nav :class="['eip-sidebar__nav', { 'scroll-y-auto': showSidebarContent }]">
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

		<v-app-bar class="main-layout__app-bar" elevation="0">
			<template #prepend>
				<v-app-bar-nav-icon class="main-layout__nav-icon" @click="toggleDrawer" />
			</template>
			<v-app-bar-title>
				<div class="main-layout__topbar d-flex ga-2 justify-space-between align-center px-2">
					<div class="main-layout__status">
						<span class="main-layout__status-dot" />
						系統運作中
					</div>
					<div class="eip-user">
						<BtnCompo class="eip-user__bell" icon variant="text">
							<v-icon>mdi-bell-outline</v-icon>
							<span class="eip-user__badge">2</span>
						</BtnCompo>
						<div class="eip-user__profile">
							<div class="eip-user__info">
								<div class="eip-user__name">王小明</div>
								<div class="eip-user__role">Neon Ops Division</div>
							</div>
							<img class="eip-user__avatar" src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
						</div>
					</div>
				</div>
			</v-app-bar-title>
		</v-app-bar>

		<v-main class="main-layout__main">
			<v-container :class="['main-layout__content', { 'main-layout__content--form': isForm }]" fluid>
				<slot/>
			</v-container>
		</v-main>
	</v-layout>
</template>

<script src="@/js/layouts/mainLayout.js"/>

<style lang="scss">
	@import '@/css/layouts/main-layout.scss';
</style>

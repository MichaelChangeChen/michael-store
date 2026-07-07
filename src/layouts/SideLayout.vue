<template>
	<div class="side-layout d-flex flex-grow-1">
		<EipSidebarRail v-model="sidebarOpen" :is-mobile="isMobile" />
		<v-app-bar class="side-layout__app-bar" elevation="0" app>
			<div class="d-flex align-center flex-grow-1">
				<BtnCompo
					v-if="isMobile"
					icon="mdi-menu"
					variant="text"
					class="side-layout__menu-btn ms-2"
					@click="sidebarOpen = !sidebarOpen" />
				<header class="eip-topbar d-flex justify-space-between align-center flex-grow-1 px-4 px-md-10">
					<InputCompo
						class="eip-topbar__search"
						@click:append-inner="handleSearch"
						placeholder="Search nodes, quests, archives..."
						rounded="pill"
						appendInnerIcon="mdi-magnify"
						bg-color="rgba(10, 18, 37, 0.88)"
						base-color="cyan-lighten-1"
						color="cyan-lighten-1"
						width="400" />
					<div class="eip-topbar__meta">
						<div class="eip-topbar__status">
							<span class="eip-topbar__status-dot" />
							System online
						</div>
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
				</header>
			</div>
		</v-app-bar>
		<v-main class="side-layout__main">
			<v-container :class="['side-layout__content', isForm ? 'form-container' : '']" fluid>
				<slot/>
			</v-container>
		</v-main>
	</div>
</template>

<script src="@/js/layouts/sideLayout.js"/>

<style scoped lang="scss">
@import '@/css/layouts/side-layout.scss';
</style>

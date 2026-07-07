<template>
	<div class="d-flex flex-grow-1">
		<EipSidebarRail v-model="sidebarOpen" :is-mobile="isMobile" />
		<v-app-bar elevation="1" app>
			<div class="d-flex align-center flex-grow-1">
				<BtnCompo
					v-if="isMobile"
					icon="mdi-menu"
					variant="text"
					class="ms-2"
					@click="sidebarOpen = !sidebarOpen" />
				<header class="eip-topbar d-flex justify-space-between align-center flex-grow-1 px-10">
					<InputCompo
						@click:append-inner="handleSearch"
						placeholder="搜尋系統功能、常用頁面或流程"
						rounded="pill"
						appendInnerIcon="mdi-magnify"
						bg-color="white"
						base-color="amber-lighten-1"
						color="amber"
						width="400" />
					<div class="eip-user">
						<BtnCompo class="eip-user__bell" icon variant="text">
							<v-icon>mdi-bell-outline</v-icon>
							<span class="eip-user__badge">2</span>
						</BtnCompo>
						<div class="eip-user__profile">
							<div class="eip-user__info">
								<div class="eip-user__name">王小明</div>
								<div class="eip-user__role">資訊安全處</div>
							</div>
							<img class="eip-user__avatar" src="https://i.pravatar.cc/150?img=11" alt="Avatar" />
						</div>
					</div>
				</header>
			</div>
		</v-app-bar>
		<v-main>
			<v-container :class="isForm ? 'form-container' : ''" fluid>
				<slot/>
			</v-container>
		</v-main>
	</div>
</template>

<script src="@/js/layouts/sideLayout.js"></script>

<style scoped lang="scss">
@import '@/css/layouts/side-layout.scss';
</style>

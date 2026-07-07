<template>
	<div class="bad-gateway-page">
		<v-card elevation="24" class="error-page pa-6">
			<div class="icon-wrap mb-4">
				<v-avatar size="160" class="icon-bg">
					<v-icon size="120" color="red-darken-2">mdi-server-network-off</v-icon>
				</v-avatar>
			</div>
			<div class="code text-red-lighten-1">502</div>
			<h2 class="title text-center mb-4">Bad Gateway</h2>
			<div class="desc text-center mb-8">
				系統目前暫時無法連線到上游服務，請稍後再試一次。
			</div>
			<div class="d-flex justify-center">
				<BtnCompo
					@click="router.push({ path: url })"
					color="red-darken-1"
					variant="tonal">
					返回上一頁
				</BtnCompo>
			</div>
		</v-card>
	</div>
</template>

<script src="@/js/error/badGatewayPage.js"></script>

<style scoped lang="scss">
@import '@/css/error/bad-gateway-page.scss';
</style>

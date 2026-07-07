<template>
	<div class="not-found-page">
		<v-card elevation="24" class="error-page pa-6">
			<v-img
				src="/images/illustrations/404-illustration.svg"
				max-height="400"
				contain/>
			<h2 class="display-2 mt-10 text-orange-darken-4 text-center">{{ message }}</h2>
			<div class="text mb-6 text-overline">Sorry we can’t seem to find the page you’re looking for.</div>
			<div v-if="shouldRedirectLogin" class="text-center text-caption text-medium-emphasis">
				倒數 {{ countdown }} 秒後回到登入頁
			</div>
		</v-card>
	</div>
</template>

<script src="@/js/error/notFoundPage.js"></script>

<style scoped lang="scss">
@import '@/css/error/not-found-page.scss';
</style>

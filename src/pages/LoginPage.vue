<template>
	<section class="login-page d-flex align-center justify-center pa-4">
		<v-card
			class="login-page__card w-100"
			max-width="480"
			rounded="xl"
			variant="flat"
			border>
			<div class="login-page__accent" />
			<div class="pa-6 pa-md-8 d-flex flex-column ga-6">
				<div class="d-flex flex-column align-center text-center ga-3">
					<div class="login-page__logo d-flex align-center justify-center">
						<span class="text-h6 font-weight-bold">LOGO</span>
					</div>
					<div class="d-flex flex-column ga-1">
						<h1 class="text-h5 font-weight-bold">系統登入</h1>
						<p class="text-body-2 text-medium-emphasis">
							此處預留標題、Logo 與說明文字區塊，可依正式需求替換。
						</p>
					</div>
				</div>

				<v-form class="d-flex flex-column ga-4" @submit.prevent="handleLogin">
					<InputCompo
						v-model="form.account"
						:rules="[e => !!e.trim()]"
						:disabled="loginLoading"
						prepend-inner-icon="mdi-account-outline"
						autocomplete="username"
						label="帳號"
						hide-details />

					<InputCompo
						v-model="form.password"
						:rules="[e => !!e.trim()]"
						:type="showPassword ? 'text' : 'password'"
						:append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
						:disabled="loginLoading"
						@click:append-inner="togglePassword"
						prepend-inner-icon="mdi-lock-outline"
						autocomplete="current-password"
						label="密碼"
						hide-details />

					<div class="d-flex flex-column ga-3">
						<InputCompo
							v-model="form.captcha"
							:rules="[e => !!e.trim()]"
							:disabled="loginLoading"
							prepend-inner-icon="mdi-shield-key-outline"
							autocomplete="off"
							autocapitalize="off"
							autocorrect="off"
							spellcheck="false"
							label="驗證碼"
							hide-details />
						<div class="d-flex align-center ga-3 flex-wrap">
							<v-sheet
								class="login-page__captcha-image d-flex align-center justify-center flex-grow-1"
								rounded="lg"
								border>
								<img
									:src="captchaImage"
									alt="驗證碼圖片"
									class="login-page__captcha-img" />
							</v-sheet>
							<BtnCompo
								:disabled="captchaLoading || loginLoading"
								@click="refreshCaptcha"
								color="amber-darken-1"
								setIcon="mdi-refresh"
								icon />
						</div>
					</div>

					<div class="d-flex flex-column ga-3 pt-2">
						<BtnCompo
							:loading="loginLoading"
							type="submit"
							color="primary"
							variant="elevated"
							size="large"
							name="登入" />
						<BtnCompo
							:disabled="loginLoading"
							color="amber-darken-3"
							name="忘記密碼" />
					</div>
				</v-form>
			</div>
		</v-card>
	</section>
</template>

<script src="@/js/loginPage.js"></script>

<style scoped lang="scss">
	@import '@/css/login-page.scss';
</style>

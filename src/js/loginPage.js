import { defineComponent, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { sha3_256 } from 'js-sha3';
import { apLogin, getCodeImageVerify } from '@/api/scsApi.js';
import useStore from '@/stores/useStores.js';

const encryptPassword = pwd => Promise.resolve(sha3_256(pwd));

export default defineComponent({
	name: 'LoginPage',
	setup() {
		const
			codeTn = ref(''),
			captchaImage = ref(''),
			showPassword = ref(false),
			loginLoading = ref(false),
			captchaLoading = ref(false),
			router = useRouter(),
			{ showNotice, setMenuData } = useStore(),
			form = reactive({
				account: '',
				password: '',
				captcha: ''
			});

		const
			togglePassword = () => showPassword.value = !showPassword.value,
			refreshCaptcha = () => {
				captchaLoading.value = true;
				getCodeImageVerify()
				.then(res => {
					codeTn.value = res?.data?.codeTn || '';
					captchaImage.value = res?.data?.verifyImage || '';
					form.captcha = '';
				})
				.catch(err => {
					captchaImage.value = '';
					codeTn.value = '';
					showNotice(err?.message || '驗證碼載入失敗，請重新嘗試。', 'error', '錯誤');
				})
				.finally(() => {
					captchaLoading.value = false;
				});
			},
			handleLogin = () => {
				if(!form.account || !form.password || !form.captcha)
					return showNotice('請完整輸入帳號、密碼與驗證碼。', 'error', '提醒');

				loginLoading.value = true;
				encryptPassword(form.password)
				.then(pwd => apLogin({
					account: form.account,
					pwd,
					verifyCode: form.captcha,
					codeTn: codeTn.value
				}))
				.then(res => {
					if([ 1, '1' ].includes(res.data.statusCode)) {
						sessionStorage.setItem('authFuncMenu', JSON.stringify(res.data?.authFuncMenu ?? []));
						sessionStorage.setItem('memberProfile', JSON.stringify(res.data?.memberProfile ?? {}));
						sessionStorage.setItem('LoginAuth', JSON.stringify({
							memberProfile: res.data?.memberProfile ?? {},
							timeStart: Date.now()
						}));
						setMenuData(res.data?.authFuncMenu);
						router.push({ name: 'eipIndex' });
						showNotice('登入成功。', 'success', '完成');
					}
					else {
						showNotice(res?.data?.message || '登入失敗。', 'error', '錯誤');
						refreshCaptcha();
					};
				})
				.catch(err => {
					showNotice(err?.response?.data?.message || err?.message || '登入失敗。', 'error', '錯誤');
					refreshCaptcha();
				})
				.finally(() => {
					loginLoading.value = false;
				});
			};

		onMounted(() => {
			refreshCaptcha();
		});

		return {
			form,
			showPassword,
			captchaImage,
			captchaLoading,
			loginLoading,
			togglePassword,
			refreshCaptcha,
			handleLogin
		};
	}
});

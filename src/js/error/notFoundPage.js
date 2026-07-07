import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
	name: 'NotFoundPage',
	setup() {
		const route = useRoute();
		const router = useRouter();
		const countdownTimer = ref(null);
		const countdown = ref(Number(route.query.countdown || 0));

		const redirectTarget = computed(() => route.query.redirect || '/login-page');
		const shouldRedirectLogin = computed(() => countdown.value > 0 && Boolean(route.query.redirect));
		const message = computed(() => route.query.message || history.state?.message || '找不到您要前往的頁面。');

		const clearCountdown = () => {
			if(countdownTimer.value) {
				window.clearInterval(countdownTimer.value);
				countdownTimer.value = null;
			}
		};

		const startCountdown = () => {
			if(!shouldRedirectLogin.value)
				return;

			clearCountdown();
			countdownTimer.value = window.setInterval(() => {
				countdown.value -= 1;
				if(countdown.value <= 0) {
					clearCountdown();
					router.replace(`${redirectTarget.value}`);
				}
			}, 1000);
		};

		onMounted(() => {
			startCountdown();
		});

		onBeforeUnmount(() => {
			clearCountdown();
		});

		return {
			message,
			countdown,
			shouldRedirectLogin
		};
	}
});

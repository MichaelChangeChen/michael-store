import { defineComponent, ref } from 'vue';
	import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'BadGatewayPage',
	setup() {
const 	router = useRouter(),
			url = ref(history.state.url);

		return {
			router,
			url
		};
	}
});

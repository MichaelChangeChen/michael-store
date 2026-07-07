import { createRouter, createWebHistory } from 'vue-router';
import { storeToRefs } from 'pinia';
import useStore from '@/stores/useStores.js';
import scsRouter from './scsRouter';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	scrollBehavior(to, from, savedPosition) {
		if(savedPosition)
			return savedPosition;

		return { top: 0 };
	},
	routes: [
		{
			path: '/',
			redirect: '/login-page'
		},
		{
			path: '/502',
			name: 'badGateway',
			component: () => import('@/pages/error/BadGatewayPage.vue'),
			meta: { layout: 'error' }
		},
		{
			path: '/error',
			name: 'error',
			component: () => import('@/pages/error/NotFoundPage.vue'),
			meta: { layout: 'error' }
		},
		...scsRouter,
	]
});

const publicRouteNames = new Set([ 'error', 'badGateway' ]);

const hasLoginSession = () => {
	try {
		const	loginAuth = JSON.parse(window.sessionStorage.getItem('LoginAuth') || 'null'),
				memberProfile = JSON.parse(window.sessionStorage.getItem('memberProfile') || 'null'),
				authFuncMenu = JSON.parse(window.sessionStorage.getItem('authFuncMenu') || 'null');
		return Boolean(loginAuth && memberProfile && authFuncMenu);
	}
	catch {
		return false;
	}
};

const collectMenuPaths = (list = []) => {
	return list.flatMap(item => {
		const 	currentPath = item?.link ? [ item.link ] : [],
				childPaths = Array.isArray(item?.items) ? collectMenuPaths(item.items) : [];

		return [ ...currentPath, ...childPaths ];
	});
};

const hasAuthMenuRoute = path => {
	const 	{ setMenu } = storeToRefs(useStore()),
			menuPaths = collectMenuPaths(setMenu.value || []);

	return menuPaths.some(menuPath =>
		path === menuPath || path.startsWith(`${menuPath}/`)
	);
};

router.beforeEach(to => {
	const 	{ setMenuData } = useStore(),
			isAuthenticated = hasLoginSession(),
			isMenuRoute = hasAuthMenuRoute(to.path),
			isPublicRoute = publicRouteNames.has(to.name);

	if(to.name === 'loginPage' && isAuthenticated)
		return { name: 'eipIndex' };
	else if(to.name === 'loginPage' && !isAuthenticated) {
		sessionStorage.removeItem('authFuncMenu');
		sessionStorage.removeItem('memberProfile');
		sessionStorage.removeItem('LoginAuth');
		setMenuData([]);
	};

	if(isMenuRoute && isAuthenticated)
		return true;

	if(isPublicRoute)
		return true;

	if(!isAuthenticated) {
		return {
			name: 'error',
			query: {
				message: '尚未登入或登入已失效，請重新登入。',
				redirect: '/login-page',
				countdown: '5'
			},
			replace: true
		};
	}

	return { name: 'error' };
});

export default router;

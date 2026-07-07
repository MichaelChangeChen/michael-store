import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import 'material-icons/iconfont/material-icons.css';
import '@mdi/font/css/materialdesignicons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import i18n from '@/plugins/vueI18n';
import shortkey from 'vue3-shortkey';
import vuetify from '@/plugins/vuetify';
import BtnCompo from '@/pages/components/btn/BtnCompo.vue';
import InputCompo from '@/pages/components/input/InputCompo.vue';

const app = createApp(App);

app.use(createPinia());
app.use(router);
// app.use(i18n);
app.use(shortkey);
app.use(vuetify);
app.component('BtnCompo', BtnCompo);
app.component('InputCompo', InputCompo);
app.mount('#app');
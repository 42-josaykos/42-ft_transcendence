import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

createApp(App).use(createPinia()).use(router).mount('#app');

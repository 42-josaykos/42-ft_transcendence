import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "@fortawesome/fontawesome-free/js/all";
import Notifications from '@kyvg/vue3-notification'
import Navbar from "@/components/Navbar.vue";

const app = createApp(App).use(createPinia());
app.use(router);
app.use(Notifications)
app.component("Navbar", Navbar);
app.mount("#app");

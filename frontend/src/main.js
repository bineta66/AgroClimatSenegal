import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { scheduleRefresh } from "./api/client";
import "./styles.css";

createApp(App)
  .use(createPinia())
  .use(router)
  .mount("#app");

if (localStorage.getItem("refresh")) {
  scheduleRefresh();
}
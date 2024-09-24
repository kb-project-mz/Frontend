import "./assets/main.css";
//import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from "vue";
import { createPinia } from "pinia";

// Font Awesome 추가 부분
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import App from "./App.vue";
import router from "./router";

import "./assets/tailwind.css";

// 아이콘을 라이브러리에 추가
library.add(faChevronLeft);

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");

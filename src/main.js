import { createApp } from "vue";
import * as VueRouter from "vue-router";

import App from "./App.vue";
import HomePage from "./pages/Home.vue";
const SettingsPage = () => import("./pages/Settings.vue");
const LoginPage = () => import("./pages/Login.vue");
const NotFoundPage = () => import("./pages/NotFound.vue");
const SettingsApp = () => import("./components/SettingsApp.vue");
const SettingsUser = () => import("./components/SettingsUser.vue");

import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/theme-chalk/index.css";

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: "/",
      alias: "/home",
      name: "Home",
      component: HomePage,
      meta: { needCorrectAppInfos: true },
      children: [
        {
          path: "home/:taskId",
          component: HomePage,
        },
      ],
    },
    {
      path: "/settings",
      name: "Settings",
      component: SettingsPage,
      meta: { needCorrectAppInfos: true },
      children: [
        {
          path: "app",
          component: SettingsApp,
          meta: { needCorrectAppInfos: false },
        },
        {
          path: "user",
          component: SettingsUser,
          meta: { needCorrectAppInfos: true },
        },
      ],
    },
    {
      path: "/login",
      name: "LogIn",
      component: LoginPage,
      // beforeEnter: (to, from) => {
      //   if (localStorage.getItem("isLoggedIn")) {
      //     return "/";
      //   }
      // },
    },
    {
      path: "/notfound",
      name: "NotFound",
      component: NotFoundPage,
    },
    {
      path: "/:wrongPath(.*)",
      redirect: (to) => {
        return { name: "NotFound", params: { wrongPath: to.params.wrongPath } };
      },
    },
  ],
});

router.beforeEach((to, from) => {
  // if (to.meta.needLoggedIn && !localStorage.getItem("isLoggedIn")) {
  //   return "/login";
  // }

  if (to.meta.needCorrectAppInfos && !localStorage.getItem("correctAppInfos")) {
    return "/settings/app";
  }
});

const app = createApp(App);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.use(router);
app.mount("#app");

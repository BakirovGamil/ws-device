import { createRouter, createWebHistory } from "vue-router";
import ConnectView from "@/views/ConnectView.vue";
import { useConnectionStore } from "@/stores/connection.ts";

export enum PageName {
  Connect = "connect",
  Gate = "gate",
  Cash = "cash",
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: PageName.Connect,
      component: ConnectView,
      meta: {
        title: "Подключение",
      },
    },
    {
      path: "/gate",
      name: PageName.Gate,
      component: () => import("../views/GateView.vue"),
      meta: {
        title: "Стойка",
        requiresConnection: true,
      },
    },
    {
      path: "/cash",
      name: PageName.Cash,
      component: () => import("../views/CashView.vue"),
      meta: {
        title: "Паркомат",
        requiresConnection: true,
      },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: { name: PageName.Connect },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const connectionStore = useConnectionStore();
  if (to.name === PageName.Connect) {
    return next();
  }

  if (to.meta.requiresConnection && !connectionStore.isConnected) {
    next({ name: PageName.Connect });
  } else {
    next();
  }
});

export default router;

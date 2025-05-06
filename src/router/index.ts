import { createRouter, createWebHistory } from "vue-router";
import ConnectView from "@/views/ConnectView.vue";
import { useConnectionStore } from "@/stores/connection.ts";

enum PageName {
  Connect = "connect",
  Device = "device",
  Cash = "cash",
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: PageName.Connect,
      component: ConnectView,
    },
    {
      path: "/device",
      name: PageName.Device,
      component: () => import("../views/DeviceView.vue"),
      meta: { requiresConnection: true }
    },
    {
      path: "/cash",
      name: PageName.Cash,
      component: () => import("../views/CashView.vue"),
      meta: { requiresConnection: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: PageName.Connect }
    }
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

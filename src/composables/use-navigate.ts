import { ref } from "vue";
import { useRouter } from "vue-router";
import { useLoadingBar } from "naive-ui";
import { PageName } from "@/router";

export const useNavigate = () => {
  const router = useRouter();
  const loadingBar = useLoadingBar();
  const isNavigating = ref(false);
  const navigateTo = async (page: PageName) => {
    loadingBar.start();
    isNavigating.value = true;
    try {
      await router.push(page);
      loadingBar.finish();
    } catch (err) {
      console.error(err);
      loadingBar.error();
    }
  };

  return { isNavigating, navigateTo };
};

import type { Router } from "vue-router";
import { useLoadingBar } from "naive-ui";
import { PageName } from "@/router";

type LoadingBarInst = ReturnType<typeof useLoadingBar>;

class NavigationService {
  private loadingBar: LoadingBarInst | null = null;
  private router: Router | null = null;

  init(router: Router, loadingBar: LoadingBarInst) {
    this.router = router;
    this.loadingBar = loadingBar;
  }

  async navigateTo(page: PageName) {
    if (!this.router || !this.loadingBar) {
      throw new Error("NavigationService not initialized");
    }

    this.loadingBar.start();
    try {
      await this.router.push(page);
      this.loadingBar.finish();
    } catch (error) {
      this.loadingBar.error();
      throw error;
    }
  }
}

export const navigationService = new NavigationService();

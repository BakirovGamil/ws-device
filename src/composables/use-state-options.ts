import { computed } from "vue";
import { STATES } from "@/defaults.ts";

export const useStateOptions = () => {
  const options = computed(() => {
    return STATES.map((state) => ({
      label: state,
      value: state,
    }));
  });

  return { options };
};

import { ref } from "vue";

const sidebarOpen = ref(false);

export function useSidebar() {
  return {
    sidebarOpen,
    toggleSidebar: () => (sidebarOpen.value = !sidebarOpen.value),
    closeSidebar: () => (sidebarOpen.value = false),
  };
}

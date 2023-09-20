import { useTabStore } from '@/stores/tab/index.js'
import { useRoute } from 'vue-router'
export default function useTab() {
  const tabStore = useTabStore()
  const route = useRoute()

  tabStore.iniTabStore(route)
  console.log(tabStore)

  return {}
}

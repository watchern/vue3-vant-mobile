<script setup lang="ts">
import { useRouteCacheStore } from '@/stores'

useHead({
  title: 'Vue3 Vant Mobile',
  meta: [
    {
      name: 'description',
      content: 'An mobile web apps template based on the Vue 3 ecosystem',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#00aba9' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})

const routeCacheStore = useRouteCacheStore()

const keepAliveRouteNames = computed(() => {
  return routeCacheStore.routeCaches
})

const mode = computed(() => {
  return isDark.value ? 'dark' : 'light'
})
const router = useRouter()
function onSwipe(...arg) {
  console.warn('onSwipe', arg)
  if (window.history.state.back) {
    history.back()
  }
  else {
    console.warn('router-replace')
    router.replace('/')
  }
}
</script>

<template>
  <div
    v-touch:swipe.left="onSwipe"
    v-touch:swipe.right="onSwipe"
    style="height:100vh"
  >
    <van-config-provider :theme="mode">
      <nav-bar />
      <router-view v-slot="{ Component }">
        <section class="app-wrapper">
          <keep-alive :include="keepAliveRouteNames">
            <component :is="Component" />
          </keep-alive>
        </section>
      </router-view>
      <tab-bar />
    </van-config-provider>
  </div>
</template>

<style scoped>
.app-wrapper {
  width: 100%;
  position: relative;
  padding: 16px;
}
</style>

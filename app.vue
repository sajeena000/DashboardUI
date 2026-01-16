<script setup>
import { useAppStore } from '~/stores/appStore'

const store = useAppStore()

onMounted(() => {
  store.initStore()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
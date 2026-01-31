<script setup>
// Redirect to admin settings page
const router = useRouter()

onMounted(() => {
  router.replace('/admin/settings')
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-950">
    <div class="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
  </div>
</template>
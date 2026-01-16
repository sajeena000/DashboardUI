<template>
  <Transition name="toast">
    <div v-if="visible" class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 border border-indigo-500/50 shadow-lg shadow-indigo-500/20 text-white">
      <div class="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
        <Check class="w-4 h-4" />
      </div>
      <div>
        <h4 class="text-sm font-semibold">{{ title }}</h4>
        <p class="text-xs text-slate-400">{{ message }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { Check } from 'lucide-vue-next'
const props = defineProps(['title', 'message'])
const visible = ref(false)

const show = () => {
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, 3000)
}

defineExpose({ show })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
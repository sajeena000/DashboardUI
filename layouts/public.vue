<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:bg-none dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
    <PublicNavbar />
    
    <main class="pt-20">
      <slot />
    </main>
    
    <PublicFooter />
    <Chatbot />

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-10 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-10 opacity-0"
    >
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-24 right-6 z-40 p-3 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 group"
        aria-label="Back to top"
      >
        <ArrowUp class="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
      </button>
    </Transition>
  </div>
</template>

<script setup>
import { ArrowUp } from 'lucide-vue-next'

const showBackToTop = ref(false)

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

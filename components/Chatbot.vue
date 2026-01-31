<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
    <!-- Chat Window -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div
        v-if="isOpen"
        class="w-[360px] h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div class="p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot class="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 class="font-bold text-white text-sm">AI Assistant</h3>
              <p class="text-indigo-100 text-xs flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button
            @click="isOpen = false"
            class="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg">
              <Bot class="w-4 h-4 text-white" />
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700 max-w-[85%]">
              <p class="text-sm text-slate-600 dark:text-slate-300">
                Hello! 👋 How can I help you today?
              </p>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <form @submit.prevent="sendMessage" class="relative">
            <input
              v-model="message"
              type="text"
              placeholder="Type your message..."
              class="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <button
              type="submit"
              :disabled="!message.trim()"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-indigo-500 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
            >
              <Send class="w-4 h-4" />
            </button>
          </form>
          <div class="text-center mt-2">
            <p class="text-[10px] text-slate-400">Powered by AI</p>
          </div>
        </div>
      </div>
    </Transition>

    <button
      @click="isOpen = !isOpen"
      class="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300 z-50 overflow-hidden"
    >
      <div class="relative z-10">
        <Transition
          enter-active-class="transition duration-300 ease-out absolute"
          enter-from-class="opacity-0 rotate-90 scale-50"
          enter-to-class="opacity-100 rotate-0 scale-100"
          leave-active-class="transition duration-150 ease-in absolute"
          leave-from-class="opacity-100 rotate-0 scale-100"
          leave-to-class="opacity-0 -rotate-90 scale-50"
        >
          <MessageCircle v-if="!isOpen" class="w-7 h-7" />
          <X v-else class="w-7 h-7" />
        </Transition>
      </div>
      
      <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
    </button>
  </div>
</template>

<script setup>
import { MessageCircle, X, Send, Bot } from 'lucide-vue-next'

const isOpen = ref(false)
const message = ref('')

const sendMessage = () => {
  if (!message.value.trim()) return
  message.value = ''
}
</script>

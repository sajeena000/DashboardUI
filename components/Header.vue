<template>
  <header class="h-16 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-20">
    <button @click="$emit('toggle-sidebar')" class="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white">
      <Menu class="w-6 h-6" />
    </button>

    <div class="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-slate-950/50 border border-white/10 w-64 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
      <Search class="w-4 h-4 text-slate-500" />
      <input 
        v-model="store.searchQuery" 
        type="text" 
        placeholder="Search team..." 
        class="bg-transparent border-none outline-none text-sm text-white placeholder-slate-600 w-full" 
      />
    </div>

    <div class="flex items-center gap-4 relative">
      <button 
        @click="showNotifications = !showNotifications"
        class="p-2 text-slate-400 hover:text-white transition-colors relative focus:outline-none"
      >
        <Bell class="w-5 h-5" />
        <span class="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
      </button>

      <div 
        v-if="showNotifications"
        class="absolute right-0 top-12 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-xl z-50 transform origin-top-right transition-all"
      >
        <div class="p-4 border-b border-white/5 flex justify-between items-center">
          <h3 class="font-display font-semibold text-white">Notifications</h3>
          <span class="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">3 New</span>
        </div>
        
        <div class="max-h-64 overflow-y-auto custom-scrollbar">
          <div v-for="(notif, index) in notifications" :key="index" class="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors flex gap-3">
            <div class="mt-1">
              <div class="w-2 h-2 rounded-full" :class="notif.color"></div>
            </div>
            <div>
              <p class="text-sm text-slate-200">{{ notif.text }}</p>
              <p class="text-xs text-slate-500 mt-1">{{ notif.time }}</p>
            </div>
          </div>
        </div>
        
        <div class="p-3 text-center border-t border-white/5 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
          <span class="text-xs font-medium text-indigo-400">Mark all as read</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Menu, Search, Bell } from 'lucide-vue-next'
import { useAppStore } from '~/stores/appStore'

const store = useAppStore()
const showNotifications = ref(false)

const notifications = [
  { text: 'New signup: "Stellar Designs"', time: '2 min ago', color: 'bg-emerald-500' },
  { text: 'Server load high (92%)', time: '1 hour ago', color: 'bg-rose-500' },
  { text: 'Project "Dashboard" was updated', time: '3 hours ago', color: 'bg-indigo-500' },
  { text: 'Weekly report is ready', time: 'Yesterday', color: 'bg-slate-500' },
]
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px; 
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155; 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>
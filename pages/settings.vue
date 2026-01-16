<template>
  <div class="max-w-2xl">
    <h1 class="text-3xl font-display font-bold text-white mb-8">Settings</h1>
    
    <div class="space-y-6 p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-300">Display Name</label>
        <input 
          v-model="form.name"
          type="text" 
          class="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-300">Email Address</label>
        <input 
          v-model="form.email"
          type="email" 
          class="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
        />
      </div>

      <div class="pt-4 flex items-center justify-between">
        <div class="flex items-center gap-2" @click="form.notifications = !form.notifications">
           <div 
             class="w-10 h-6 rounded-full relative cursor-pointer transition-colors"
             :class="form.notifications ? 'bg-indigo-600' : 'bg-slate-700'"
           >
             <div 
               class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300"
               :class="form.notifications ? 'right-1' : 'left-1'"
             ></div>
           </div>
           <span class="text-sm text-slate-400">Email Notifications</span>
        </div>
        
        <button 
          @click="saveSettings"
          class="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
        >
          Save Changes
        </button>
      </div>
    </div>

    <UiToast ref="toastRef" title="Settings Saved" message="Your profile has been updated." />
  </div>
</template>

<script setup>
import { useAppStore } from '~/stores/appStore'

const store = useAppStore()
const toastRef = ref(null)

const form = ref({
  name: store.userProfile.name,
  email: store.userProfile.email,
  notifications: store.userProfile.notifications
})

const saveSettings = () => {
  store.updateSettings(form.value)
  toastRef.value.show()
}
</script>
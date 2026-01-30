<template>
  <div class="max-w-2xl">
    <h1 class="text-3xl font-display font-bold text-white mb-8">Settings</h1>
    
    <div class="space-y-6 p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-300">Display Name</label>
        <input 
          v-model="form.name"
          type="text" 
          :disabled="!canEditSettings"
          class="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-300">Email Address</label>
        <input 
          v-model="form.email"
          type="email" 
          :disabled="!canEditSettings"
          class="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-300">User Role</label>
        <div v-if="canChangeRoles">
          <select 
            v-model="form.userRole"
            class="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="member">Member</option>
          </select>
          <p class="text-xs text-slate-500 mt-1">
            Admin: full access · Manager: add/edit members · Member: view only
          </p>
        </div>
        <div v-else class="flex items-center gap-2">
          <span 
            class="px-3 py-1.5 rounded-lg text-sm font-medium capitalize"
            :class="{
              'bg-indigo-500/20 text-indigo-400': form.userRole === 'admin',
              'bg-amber-500/20 text-amber-400': form.userRole === 'manager',
              'bg-slate-500/20 text-slate-400': form.userRole === 'member'
            }"
          >
            {{ form.userRole }}
          </span>
          <span class="text-xs text-slate-500">Only Admins can change roles</span>
        </div>
      </div>

      <div class="pt-4 flex items-center justify-between">
        <div class="flex items-center gap-2" @click="canEditSettings && (form.notifications = !form.notifications)">
           <div 
             class="w-10 h-6 rounded-full relative transition-colors"
             :class="[
               form.notifications ? 'bg-indigo-600' : 'bg-slate-700',
               canEditSettings ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
             ]"
           >
             <div 
               class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300"
               :class="form.notifications ? 'right-1' : 'left-1'"
             ></div>
           </div>
           <span class="text-sm text-slate-400">Email Notifications</span>
        </div>
        
        <button 
          v-if="canEditSettings"
          @click="saveSettings"
          class="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20"
        >
          Save Changes
        </button>
      </div>

      <div v-if="!canEditSettings" class="pt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <p class="text-sm text-amber-400">
          <strong>View Only:</strong> Your role doesn't allow editing settings. Contact an Admin for changes.
        </p>
      </div>
    </div>

    <UiToast ref="toastRef" title="Settings Saved" message="Your profile has been updated." />
  </div>
</template>

<script setup>
import { useAppStore } from '~/stores/appStore'
import { usePermissions } from '~/composables/usePermissions'

const store = useAppStore()
const { canEditSettings, canChangeRoles } = usePermissions()
const toastRef = ref(null)

const form = ref({
  name: store.userProfile.name,
  email: store.userProfile.email,
  notifications: store.userProfile.notifications,
  userRole: store.userProfile.userRole
})

const saveSettings = () => {
  store.updateSettings(form.value)
  toastRef.value.show()
}
</script>
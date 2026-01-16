<template>
  <aside class="h-full flex flex-col bg-slate-900/50 backdrop-blur-xl border-r border-white/5">
    <div class="h-16 flex items-center px-6 border-b border-white/5">
      <UiLogo />
    </div>

    <nav class="flex-1 px-4 py-6 space-y-1">
      <NuxtLink 
        v-for="link in links" 
        :key="link.path" 
        :to="link.path"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden"
        :class="route.path === link.path ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-white/5'"
        @click="$emit('close-mobile')"
      >
        <div v-if="route.path === link.path" class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full"></div>
        
        <component :is="link.icon" class="w-5 h-5 transition-transform group-hover:scale-110" />
        <span class="font-medium text-sm">{{ link.name }}</span>
      </NuxtLink>
    </nav>

    <div class="p-4 border-t border-white/5">
      <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
        <img 
          :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${store.userProfile.name}`" 
          alt="User" 
          class="w-8 h-8 rounded-full bg-slate-700" 
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">{{ store.userProfile.name }}</p>
          <p class="text-xs text-slate-500 truncate">{{ store.userProfile.email }}</p>
        </div>

        <button 
          @click="handleLogout" 
          class="p-1 text-slate-500 hover:text-rose-400 transition-colors"
          title="Sign Out"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { Home, PieChart, Settings, Users, LogOut } from 'lucide-vue-next'
import { useAppStore } from '~/stores/appStore'

const route = useRoute()
const router = useRouter()
const store = useAppStore() 

const handleLogout = () => {
  store.logout()
  router.push('/login')
}

const links = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Analytics', path: '/analytics', icon: PieChart },
  { name: 'Team', path: '/team', icon: Users },
  { name: 'Settings', path: '/settings', icon: Settings },
]
</script>
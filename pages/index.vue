<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-display font-bold text-white mb-2">Dashboard</h1>
      <p class="text-slate-400">Overview of your current performance metrics.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Revenue" value="$45,231" :trend="12.5" :icon="DollarSign" />
      <StatCard title="Active Users" value="2,450" :trend="8.2" :icon="Users" />
      <StatCard title="Bounce Rate" value="42.3%" :trend="-2.1" :icon="Activity" />
      <StatCard title="Active Sessions" value="12m 30s" :trend="4.5" :icon="Clock" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm flex flex-col">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-display font-semibold text-white">Revenue Overview</h2>
          
          <select 
            v-model="selectedPeriod"
            class="bg-slate-950 border border-white/10 rounded-lg text-xs text-slate-400 px-3 py-1 outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
        
        <div class="h-64 w-full">
          <SimpleChart :data="chartData" />
        </div>
      </div>

      <div class="p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
        <h2 class="text-lg font-display font-semibold text-white mb-6">Recent Activity</h2>
        <div class="space-y-6">
          <div v-for="i in 4" :key="i" class="flex gap-4 items-start">
            <div class="w-2 h-2 mt-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
            <div>
              <p class="text-sm text-slate-300">New user registered</p>
              <p class="text-xs text-slate-500 mt-1">2 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DollarSign, Users, Activity, Clock } from 'lucide-vue-next'

const selectedPeriod = ref('7d')
const data7d = [35, 45, 30, 60, 75, 50, 65, 80, 70, 45, 90, 60]
const data30d = [20, 25, 40, 30, 45, 35, 30, 50, 60, 55, 40, 30]

const chartData = computed(() => {
  return selectedPeriod.value === '7d' ? data7d : data30d
})
</script>
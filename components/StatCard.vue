<template>
  <div class="group relative p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all duration-300 hover:bg-slate-800/50 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div class="relative z-10">
      <div class="flex justify-between items-start mb-4">
        <div class="p-2 rounded-lg bg-white/5 text-indigo-400">
          <component :is="icon" class="w-6 h-6" />
        </div>
        <span class="text-xs font-medium px-2 py-1 rounded-full" 
          :class="trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'">
          {{ trend > 0 ? '+' : ''}}{{ trend }}%
        </span>
      </div>
      
      <h3 class="text-slate-400 text-sm font-medium mb-1">{{ title }}</h3>
      <p class="text-2xl font-display font-bold text-white">{{ value }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps(['title', 'value', 'trend', 'icon'])
</script>
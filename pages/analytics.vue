<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-display font-bold text-white mb-2">Analytics</h1>
        <p class="text-slate-400">Traffic sources and user engagement.</p>
      </div>
      <div class="flex gap-2">
        <button class="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium border border-white/10 transition-colors">
          Download CSV
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 rounded-2xl bg-slate-900/40 border border-white/5 relative overflow-hidden">
        <div class="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <p class="text-slate-400 text-sm mb-1">Page Views</p>
        <p class="text-3xl font-display font-bold text-white">2.4M</p>
        <div class="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full bg-indigo-500 w-[70%]"></div>
        </div>
      </div>
      
      <div class="p-6 rounded-2xl bg-slate-900/40 border border-white/5 relative overflow-hidden">
        <div class="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <p class="text-slate-400 text-sm mb-1">Avg. Duration</p>
        <p class="text-3xl font-display font-bold text-white">4m 12s</p>
        <div class="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full bg-emerald-500 w-[45%]"></div>
        </div>
      </div>

      <div class="p-6 rounded-2xl bg-slate-900/40 border border-white/5 relative overflow-hidden">
        <div class="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <p class="text-slate-400 text-sm mb-1">Conversion Rate</p>
        <p class="text-3xl font-display font-bold text-white">3.8%</p>
        <div class="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full bg-purple-500 w-[30%]"></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
        <h3 class="text-lg font-display font-semibold text-white mb-6">Top Referrers</h3>
        <div class="space-y-5">
          <div v-for="source in sources" :key="source.name" class="group">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-slate-300 font-medium">{{ source.name }}</span>
              <span class="text-slate-400">{{ source.value }}%</span>
            </div>
            <div class="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
              <div 
                class="h-full rounded-full transition-all duration-1000 group-hover:brightness-125"
                :class="source.color"
                :style="{ width: source.value + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
        <h3 class="text-lg font-display font-semibold text-white mb-6">Device Breakdown</h3>
        <div class="flex items-center gap-4 mb-8">
           <div class="flex-1 h-32 bg-slate-950 rounded-xl border border-white/5 flex items-end justify-center pb-0 overflow-hidden relative group">
             <div class="w-12 bg-indigo-500/80 h-[60%] rounded-t-lg group-hover:h-[65%] transition-all"></div>
             <span class="absolute bottom-2 text-xs text-white">Mobile</span>
           </div>
           <div class="flex-1 h-32 bg-slate-950 rounded-xl border border-white/5 flex items-end justify-center pb-0 overflow-hidden relative group">
             <div class="w-12 bg-purple-500/80 h-[80%] rounded-t-lg group-hover:h-[85%] transition-all"></div>
             <span class="absolute bottom-2 text-xs text-white">Desktop</span>
           </div>
           <div class="flex-1 h-32 bg-slate-950 rounded-xl border border-white/5 flex items-end justify-center pb-0 overflow-hidden relative group">
             <div class="w-12 bg-emerald-500/80 h-[20%] rounded-t-lg group-hover:h-[25%] transition-all"></div>
             <span class="absolute bottom-2 text-xs text-white">Tablet</span>
           </div>
        </div>
        <p class="text-sm text-slate-400">
          Desktop traffic is performing 25% better than mobile this week. Consider optimizing mobile checkout flow.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const sources = [
  { name: 'Direct', value: 45, color: 'bg-indigo-500' },
  { name: 'Google Search', value: 32, color: 'bg-purple-500' },
  { name: 'Twitter / X', value: 15, color: 'bg-sky-500' },
  { name: 'Newsletter', value: 8, color: 'bg-emerald-500' },
]
</script>
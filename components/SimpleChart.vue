<template>
  <div class="w-full h-full flex items-end justify-between gap-2">
    <div 
      v-for="(bar, index) in data" 
      :key="index"
      class="w-full bg-indigo-500/20 hover:bg-indigo-500/40 rounded-t-sm relative group transition-all duration-500 ease-out"
      :style="{ height: `${bar}%` }"
    >
      <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 z-10 shadow-xl">
        {{ bar }}%
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    required: true
  }
})
</script>
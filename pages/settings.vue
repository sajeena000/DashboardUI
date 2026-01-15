<template>
  <div class="max-w-2xl">
    <h1 class="text-3xl font-display font-bold text-white mb-8">Settings</h1>
    
    <div class="space-y-6 p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-300">Display Name</label>
        <input type="text" value="Intern Developer" class="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-300">Email Address</label>
        <input type="email" value="dev@dashboard.com" class="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" />
      </div>

      <div class="pt-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
           <div class="w-10 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
             <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
           </div>
           <span class="text-sm text-slate-400">Email Notifications</span>
        </div>
        <button class="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20">
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>
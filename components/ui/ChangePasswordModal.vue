<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('update:modelValue', false)"></div>
        
        <div class="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden transform transition-all">
          <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center">
                <lock-icon class="w-5 h-5 text-indigo-500" />
              </div>
              <h3 class="text-xl font-display font-bold text-white">Change Password</h3>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div class="space-y-1">
                <label class="text-sm font-medium text-slate-300">Current Password</label>
                <input 
                  v-model="currentPassword"
                  type="password" 
                  placeholder="Enter current password"
                  class="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-slate-300">New Password</label>
                <input 
                  v-model="newPassword"
                  type="password" 
                  placeholder="Enter new password"
                  class="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  required
                />
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-slate-300">Confirm New Password</label>
                <input 
                  v-model="confirmPassword"
                  type="password" 
                  placeholder="Confirm new password"
                  class="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  required
                />
              </div>

              <div v-if="error" class="text-rose-400 text-sm text-center bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">
                {{ error }}
              </div>

              <div class="flex gap-3 pt-2">
                <button 
                  type="button"
                  @click="$emit('update:modelValue', false)" 
                  class="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  :disabled="isLoading"
                  class="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  <span v-if="!isLoading">Update Password</span>
                  <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { Lock as LockIcon } from 'lucide-vue-next'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'success'])

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'New passwords do not match'
    return
  }

  if (newPassword.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    await $fetch('/api/admin/change-password', {
      method: 'POST',
      body: {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value
      }
    })
    
    emit('success')
    emit('update:modelValue', false)
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (e) {
    error.value = e.data?.message || e.statusMessage || 'Failed to change password'
  } finally {
    isLoading.value = false
  }
}

// Reset form when modal closes
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    error.value = ''
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>

<template>
  <div class="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6 mt-4">
    <!-- Mobile view -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="updatePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center rounded-lg border border-white/10 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50"
      >
        Previous
      </button>
      <button
        @click="updatePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="relative ml-3 inline-flex items-center rounded-lg border border-white/10 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-50"
      >
        Next
      </button>
    </div>
    
    <!-- Desktop view -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-slate-400">
          Showing
          <span class="font-medium text-white">{{ total === 0 ? 0 : from }}</span>
          to
          <span class="font-medium text-white">{{ total === 0 ? 0 : to }}</span>
          of
          <span class="font-medium text-white">{{ total }}</span>
          results
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            @click="updatePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
          >
            <span class="sr-only">Previous</span>
            <ChevronLeft class="h-5 w-5" aria-hidden="true" />
          </button>
          
          <template v-for="(page, index) in visiblePages" :key="index">
            <span
              v-if="page === '...'"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-400 ring-1 ring-inset ring-white/10"
            >...</span>
            <button
              v-else
              @click="updatePage(page)"
              :class="[
                page === currentPage
                  ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  : 'text-slate-300 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:outline-offset-0',
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20'
              ]"
            >
              {{ page }}
            </button>
          </template>
          
          <button
            @click="updatePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-white/10 hover:bg-white/5 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
          >
            <span class="sr-only">Next</span>
            <ChevronRight class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:currentPage'])

const totalPages = computed(() => Math.ceil(props.total / props.itemsPerPage))

const from = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
const to = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.total))

const visiblePages = computed(() => {
  const pages = []
  if (totalPages.value <= 7) {
      for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  } else {
      if (props.currentPage <= 4) {
          pages.push(1, 2, 3, 4, 5, '...', totalPages.value)
      } else if (props.currentPage >= totalPages.value - 3) {
          pages.push(1, '...', totalPages.value - 4, totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value)
      } else {
          pages.push(1, '...', props.currentPage - 1, props.currentPage, props.currentPage + 1, '...', totalPages.value)
      }
  }
  return pages
})

const updatePage = (page) => {
  if (page === '...' || page === props.currentPage) return
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
  }
}
</script>

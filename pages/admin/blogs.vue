<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-display font-bold text-white mb-2">Blog Posts</h1>
        <p class="text-slate-400">Manage blog content for the public website.</p>
      </div>
      
      <button 
        @click="openModal()"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20 transition-all"
      >
        + New Post
      </button>
    </div>

    <div v-if="loading" class="text-center py-20">
      <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-slate-500 mt-4">Loading posts...</p>
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-20 border border-dashed border-white/10 rounded-2xl">
      <FileText class="w-12 h-12 text-slate-500 mx-auto mb-4" />
      <p class="text-slate-400 mb-2">No blog posts yet</p>
      <button 
        @click="openModal()"
        class="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
      >
        Create your first post
      </button>
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="post in posts" 
        :key="post.id"
        class="p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col md:flex-row md:items-center gap-4"
      >
        <div class="w-24 h-16 shrink-0 bg-slate-800 rounded-lg overflow-hidden">
          <img 
            v-if="post.coverImage" 
            :src="post.coverImage" 
            :alt="post.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <FileText class="w-6 h-6 text-slate-600" />
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="text-white font-medium text-lg truncate">{{ post.title }}</h3>
          <p class="text-slate-500 text-sm truncate">{{ post.slug }}</p>
        </div>

        <div class="flex items-center gap-4">
          <span 
            class="px-3 py-1 text-xs font-medium rounded-full"
            :class="post.publishedAt 
              ? 'bg-emerald-500/20 text-emerald-400' 
              : 'bg-amber-500/20 text-amber-400'"
          >
            {{ post.publishedAt ? 'Published' : 'Draft' }}
          </span>

          <span class="text-slate-500 text-sm hidden md:block">
            {{ formatDate(post.createdAt) }}
          </span>

          <div class="flex gap-2">
            <button 
              @click="openModal(post)"
              class="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Edit"
            >
              <Pencil class="w-4 h-4" />
            </button>
            <button 
              @click="confirmDelete(post)"
              class="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <UiPagination 
        v-if="totalItems > 0"
        v-model:current-page="currentPage"
        :total="totalItems"
        :items-per-page="itemsPerPage"
      />
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showModal = false"></div>
        
        <div class="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-display font-bold text-white">
              {{ isEditing ? 'Edit Post' : 'Create Post' }}
            </h3>
            <button @click="showModal = false" class="text-slate-400 hover:text-white">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form class="space-y-4" @submit.prevent="handleSubmit">
            <div class="space-y-1">
              <label class="text-sm font-medium text-slate-300">Title</label>
              <input 
                v-model="form.title" 
                required
                type="text" 
                class="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-slate-300">Slug</label>
              <input 
                v-model="form.slug" 
                required
                type="text" 
                placeholder="url-friendly-slug"
                class="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-slate-300">Cover Image URL</label>
              <input 
                v-model="form.coverImage" 
                type="url" 
                placeholder="https://..."
                class="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all" 
              />
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-slate-300">Excerpt</label>
              <textarea 
                v-model="form.excerpt"
                rows="2"
                placeholder="A brief summary of the post..."
                class="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none" 
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-slate-300">Content (Markdown)</label>
              <textarea 
                v-model="form.content"
                required
                rows="10"
                placeholder="Write your post content in Markdown..."
                class="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none" 
              ></textarea>
              <p class="text-xs text-slate-500">Supports Markdown: **bold**, *italic*, # headers, etc.</p>
            </div>

            <div class="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-white/5">
              <div>
                <p class="text-sm font-medium text-white">Publish Now</p>
                <p class="text-xs text-slate-500">Make this post visible on the public website</p>
              </div>
              <button 
                type="button"
                @click="form.published = !form.published"
                class="w-12 h-7 rounded-full relative transition-colors"
                :class="form.published ? 'bg-indigo-600' : 'bg-slate-700'"
              >
                <div 
                  class="absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300"
                  :class="form.published ? 'right-1' : 'left-1'"
                ></div>
              </button>
            </div>

            <div class="pt-4 flex gap-3">
              <button 
                type="button"
                @click="showModal = false" 
                class="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                :disabled="saving"
                class="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-70"
              >
                {{ saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Post') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <UiConfirmModal 
      v-model="isDeleting"
      title="Delete Post"
      :description="`Are you sure you want to delete '${postToDelete?.title}'? This action cannot be undone.`"
      confirm-text="Delete"
      @confirm="handleDelete"
    />

    <UiToast ref="toastRef" :title="toastTitle" :message="toastMessage" :type="toastType" />
  </div>
</template>

<script setup>
import { FileText, Pencil, Trash2, X } from 'lucide-vue-next'

const posts = ref([])
const loading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const isDeleting = ref(false)
const postToDelete = ref(null)
const toastRef = ref(null)
const toastTitle = ref('')
const toastMessage = ref('')
const toastType = ref('success')

const currentPage = ref(1)
const totalItems = ref(0)
const itemsPerPage = ref(10)

const form = ref({
  id: null,
  title: '',
  slug: '',
  coverImage: '',
  excerpt: '',
  content: '',
  published: false
})

onMounted(() => {
  fetchPosts()
})

const fetchPosts = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/blogs', {
      params: {
        page: currentPage.value,
        limit: itemsPerPage.value
      }
    })
    posts.value = response.data
    totalItems.value = response.meta.total
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  } finally {
    loading.value = false
  }
}

watch(currentPage, () => {
  fetchPosts()
})

const openModal = (post = null) => {
  if (post) {
    isEditing.value = true
    form.value = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      coverImage: post.coverImage || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      published: !!post.publishedAt
    }
  } else {
    isEditing.value = false
    form.value = {
      id: null,
      title: '',
      slug: '',
      coverImage: '',
      excerpt: '',
      content: '',
      published: false
    }
  }
  showModal.value = true
}

const handleSubmit = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      await $fetch(`/api/blogs/${form.value.id}`, {
        method: 'PUT',
        body: form.value
      })
      toastTitle.value = 'Updated'
      toastMessage.value = 'Blog post updated successfully.'
    } else {
      await $fetch('/api/blogs', {
        method: 'POST',
        body: form.value
      })
      toastTitle.value = 'Created'
      toastMessage.value = 'Blog post created successfully.'
    }
    toastType.value = 'success'
    showModal.value = false
    fetchPosts()
  } catch (error) {
    toastTitle.value = 'Error'
    toastMessage.value = 'Failed to save post.'
    toastType.value = 'error'
    console.error(error)
  } finally {
    saving.value = false
    toastRef.value.show()
  }
}

const confirmDelete = (post) => {
  postToDelete.value = post
  isDeleting.value = true
}

const handleDelete = async () => {
  if (!postToDelete.value) return
  
  try {
    await $fetch(`/api/blogs/${postToDelete.value.id}`, { method: 'DELETE' })
    toastTitle.value = 'Deleted'
    toastMessage.value = 'Blog post deleted.'
    toastType.value = 'success'
    fetchPosts()
  } catch (error) {
    toastTitle.value = 'Error'
    toastMessage.value = 'Failed to delete post.'
    toastType.value = 'error'
  } finally {
    isDeleting.value = false
    postToDelete.value = null
    toastRef.value.show()
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Auto-generate slug from title
watch(() => form.value.title, (title) => {
  if (!isEditing.value) {
    form.value.slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
})
</script>

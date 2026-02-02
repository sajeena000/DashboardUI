<template>
  <div>
    <section class="relative py-20 bg-blue-500 dark:!bg-slate-950 overflow-hidden transition-colors duration-300">
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-72 h-72 bg-white/10 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-4">Services & Pricing</h1>
        <p class="text-white/80 text-lg max-w-2xl mx-auto">
          Flexible plans designed to scale with your business needs
        </p>
      </div>
    </section>

    <!-- Pricing Cards -->
    <section class="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Basic Plan -->
          <div class="relative p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-500/50 transition-colors">
            <div class="mb-6">
              <h3 class="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">Basic</h3>
              <p class="text-slate-600 dark:text-slate-400 text-sm">Perfect for startups and small projects</p>
            </div>
            <div class="mb-6">
              <span class="text-4xl font-display font-bold text-slate-900 dark:text-white">$2,999</span>
              <span class="text-slate-500 text-sm">/project</span>
            </div>
            <ul class="space-y-3 mb-8">
              <li v-for="feature in basicFeatures" :key="feature" class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Check class="w-5 h-5 text-emerald-500 shrink-0" />
                {{ feature }}
              </li>
            </ul>
            <button 
              @click="handleBuyNow('Basic')"
              class="w-full py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              Get Started
            </button>
          </div>

          <div class="relative p-8 bg-blue-600 dark:bg-slate-800 rounded-3xl shadow-2xl shadow-blue-500/20 dark:shadow-blue-500/10 scale-105 border border-blue-500/50">
            <div class="absolute top-0 right-6 -translate-y-1/2 px-4 py-1 bg-amber-400 text-slate-900 text-xs font-bold rounded-full">
              POPULAR
            </div>
            <div class="mb-6">
              <h3 class="text-xl font-display font-bold text-white mb-2">Professional</h3>
              <p class="text-blue-100 dark:text-white/80 text-sm">For growing businesses with complex needs</p>
            </div>
            <div class="mb-6">
              <span class="text-4xl font-display font-bold text-white">$9,999</span>
              <span class="text-blue-100/70 dark:text-white/70 text-sm">/project</span>
            </div>
            <ul class="space-y-3 mb-8">
              <li v-for="feature in proFeatures" :key="feature" class="flex items-center gap-3 text-sm text-blue-50 dark:text-white/90">
                <Check class="w-5 h-5 text-blue-200 dark:text-emerald-300 shrink-0" />
                {{ feature }}
              </li>
            </ul>
            <button 
              @click="handleBuyNow('Professional')"
              class="w-full py-3 bg-white dark:bg-blue-600 text-blue-600 dark:text-white rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-500 transition-colors"
            >
              Get Started
            </button>
          </div>

          <!-- Enterprise Plan -->
          <div class="relative p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-500/50 transition-colors">
            <div class="mb-6">
              <h3 class="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">Enterprise</h3>
              <p class="text-slate-600 dark:text-slate-400 text-sm">Custom solutions for large organizations</p>
            </div>
            <div class="mb-6">
              <span class="text-4xl font-display font-bold text-slate-900 dark:text-white">Custom</span>
              <span class="text-slate-500 text-sm">/tailored</span>
            </div>
            <ul class="space-y-3 mb-8">
              <li v-for="feature in enterpriseFeatures" :key="feature" class="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Check class="w-5 h-5 text-emerald-500 shrink-0" />
                {{ feature }}
              </li>
            </ul>
            <button 
              @click="handleBuyNow('Enterprise')"
              class="w-full py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Detail -->
    <section class="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">Our Expertise</h2>
          <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Comprehensive software development services across all major platforms
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div v-for="service in detailedServices" :key="service.title" class="p-8 bg-white dark:bg-slate-900 rounded-3xl hover:shadow-xl transition-shadow border border-slate-100 dark:border-slate-800">
            <div class="flex items-start gap-6">
              <div class="w-14 h-14 shrink-0 rounded-2xl bg-blue-500/10 dark:bg-blue-500/10 flex items-center justify-center">
                <component :is="service.icon" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">{{ service.title }}</h3>
                <p class="text-slate-600 dark:text-slate-400 text-sm mb-4">{{ service.description }}</p>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="tech in service.technologies" 
                    :key="tech" 
                    class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div class="max-w-3xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        </div>

        <div class="space-y-4">
          <div v-for="(faq, index) in faqs" :key="index" class="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <button 
              @click="toggleFaq(index)"
              class="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <span class="font-medium text-slate-900 dark:text-white">{{ faq.question }}</span>
              <ChevronDown 
                class="w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform" 
                :class="{ 'rotate-180': openFaq === index }"
              />
            </button>
            <div v-if="openFaq === index" class="px-6 pb-6 text-slate-600 dark:text-slate-400 text-sm">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Alert Toast -->
    <Teleport to="body">
      <Transition name="slide">
        <div 
          v-if="showAlert" 
          class="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-4 bg-slate-900 text-white rounded-xl shadow-2xl flex items-center gap-3 z-50"
        >
          <Clock class="w-5 h-5 text-amber-400" />
          <span>{{ alertMessage }}</span>
          <button @click="showAlert = false" class="ml-2 text-slate-400 hover:text-white">
            <X class="w-4 h-4" />
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { Check, Globe, Smartphone, Bot, Cloud, ChevronDown, Clock, X } from 'lucide-vue-next'

definePageMeta({
  layout: 'public'
})

const showAlert = ref(false)
const alertMessage = ref('')
const openFaq = ref(null)

const handleBuyNow = (plan) => {
  alertMessage.value = `${plan} plan coming soon! Contact us for more information.`
  showAlert.value = true
  setTimeout(() => { showAlert.value = false }, 4000)
}

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index
}

const basicFeatures = [
  'Single page web application',
  'Responsive design',
  'Basic SEO optimization',
  '30 days support',
  'Source code delivery'
]

const proFeatures = [
  'Multi-page web application',
  'Custom API development',
  'Database integration',
  'Admin dashboard',
  '90 days support',
  'Priority communication'
]

const enterpriseFeatures = [
  'Full-stack custom solution',
  'Microservices architecture',
  'Cloud infrastructure setup',
  'Dedicated team assigned',
  '1 year support & maintenance',
  'SLA guarantee'
]

const detailedServices = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Full-stack web applications built with modern frameworks. From simple landing pages to complex enterprise solutions.',
    technologies: ['Vue.js', 'React', 'Node.js', 'PostgreSQL', 'AWS']
  },
  {
    icon: Smartphone,
    title: 'Mobile Development',
    description: 'Native and cross-platform mobile applications for iOS and Android, optimized for performance and user experience.',
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin']
  },
  {
    icon: Bot,
    title: 'AI & Machine Learning',
    description: 'Intelligent solutions powered by cutting-edge AI and ML technologies. Automation, prediction, and optimization.',
    technologies: ['Python', 'TensorFlow', 'OpenAI', 'LangChain']
  },
  {
    icon: Cloud,
    title: 'DevOps & Cloud',
    description: 'Cloud infrastructure, CI/CD pipelines, and scalable architectures. Reliable deployment and monitoring solutions.',
    technologies: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Terraform']
  }
]

const faqs = [
  {
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary based on complexity. A basic project typically takes 4-6 weeks, while professional tier projects range from 2-4 months. Enterprise solutions are scoped individually.'
  },
  {
    question: 'Do you offer ongoing maintenance?',
    answer: 'Yes! All our plans include post-launch support. We also offer extended maintenance contracts for clients who need long-term support and updates.'
  },
  {
    question: 'Can I request changes during development?',
    answer: 'Absolutely. We follow an agile methodology with regular check-ins and demos. Minor adjustments are included; significant scope changes are discussed and quoted separately.'
  },
  {
    question: 'What technologies do you specialize in?',
    answer: 'We work with modern tech stacks including Vue.js, React, Node.js, Python, and cloud platforms like AWS and GCP. We choose the best tools for each project\'s specific needs.'
  }
]
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>

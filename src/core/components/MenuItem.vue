<template>
  <li :class="[baseClasses, active ? 'bg-white/20 font-semibold' : 'opacity-90']">
    <i :class="['lucide-' + icon]"></i>
    <span>{{ label }}</span>
  </li>
</template>

<script>
  export default {
    name: 'MenuItem',
    props: {
      icon: { type: String, required: true },
      label: { type: String, required: true },
      active: { type: Boolean, default: false }
    },
    data() {
      return {
        baseClasses:
          'flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-white/10 transition rounded-md mx-2'
      }
    }
  }
</script>

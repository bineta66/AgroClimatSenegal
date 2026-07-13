<script setup>
defineProps({
  label: { type: String, default: "" },
  value: { type: [String, Number], default: "" },
  subtitle: { type: String, default: "" },
  color: { type: String, default: "blue" },
});
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] transition hover:-translate-y-0.5 hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.03)]">
    <div class="w-[52px] h-[52px] rounded-xl grid place-items-center flex-shrink-0" :class="{
      'bg-primary/10 text-primary': color === 'blue',
      'bg-success/10 text-success': color === 'green',
      'bg-warning/10 text-warning': color === 'orange',
      'bg-danger/10 text-danger': color === 'red',
    }">
      <slot name="icon" />
    </div>
    <div class="flex flex-col gap-0.5">
      <span class="text-sm text-slate-500 font-medium">{{ label }}</span>
      <span class="text-3xl font-bold tracking-tight">{{ value }}</span>
      <span class="text-xs text-slate-500">{{ subtitle }}</span>
    </div>
  </div>
</template>

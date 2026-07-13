<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import Chart from "chart.js/auto";

const props = defineProps({
  type: { type: String, default: "doughnut" },
  labels: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] },
  colors: { type: Array, default: () => [] },
  centerText: { type: [String, Number], default: "" },
});

const canvas = ref(null);
let chart = null;

const data = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      data: props.values,
      backgroundColor: props.type === "bar" ? props.colors[0] : props.colors,
      borderWidth: 0,
      borderRadius: props.type === "bar" ? 8 : 0,
      maxBarThickness: 54,
    },
  ],
}));

const centerTextPlugin = {
  id: "centerText",
  afterDraw(instance) {
    if (instance.config.type !== "doughnut") return;
    const { ctx, chartArea } = instance;
    if (!chartArea) return;
    const x = (chartArea.left + chartArea.right) / 2;
    const y = (chartArea.top + chartArea.bottom) / 2;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#0f172a";
    ctx.font = "700 30px Inter, system-ui, sans-serif";
    ctx.fillText(String(props.centerText), x, y - 6);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "500 13px Inter, system-ui, sans-serif";
    ctx.fillText("Total", x, y + 18);
    ctx.restore();
  },
};

const barLabelsPlugin = {
  id: "barLabels",
  afterDatasetsDraw(instance) {
    if (instance.config.type !== "bar") return;
    const { ctx } = instance;
    const meta = instance.getDatasetMeta(0);
    ctx.save();
    ctx.fillStyle = "#64748b";
    ctx.font = "600 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    meta.data.forEach((bar, i) => {
      const value = instance.data.datasets[0].data[i];
      ctx.fillText(String(value), bar.x, bar.y - 4);
    });
    ctx.restore();
  },
};

function render() {
  if (!canvas.value) return;
  const base = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { padding: 10 } },
  };
  const options =
    props.type === "doughnut"
      ? { ...base, cutout: "72%" }
      : {
          ...base,
          scales: {
            x: { grid: { display: false }, ticks: { color: "#64748b" } },
            y: {
              beginAtZero: true,
              grid: { color: "#eef2f7" },
              ticks: { color: "#64748b" },
              border: { display: false },
            },
          },
        };

  if (chart) {
    chart.data = data.value;
    chart.update();
  } else {
    chart = new Chart(canvas.value, {
      type: props.type,
      data: data.value,
      options,
      plugins: props.type === "doughnut" ? [centerTextPlugin] : [barLabelsPlugin],
    });
  }
}

onMounted(render);
watch(data, render, { deep: true });
onUnmounted(() => {
  chart?.destroy();
  chart = null;
});
</script>

<template>
  <div class="h-[260px] relative">
    <canvas ref="canvas"></canvas>
  </div>
</template>

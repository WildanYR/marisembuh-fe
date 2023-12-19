<script setup lang="ts">
import { computed } from "vue";
import LoadingSpinner from "./icon/LoadingSpinner.vue";
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  spinnerClass: {
    type: String,
  },
});

const spinnerClass = computed((): string[] => {
  const className = ["animate-spin inline"];
  if (props.spinnerClass) {
    className.push(props.spinnerClass);
  } else {
    className.push("h-4 w-4 mr-2");
  }
  return className;
});
</script>

<template>
  <button :disabled="props.loading">
    <LoadingSpinner
      v-show="props.loading"
      :class="spinnerClass"
    ></LoadingSpinner>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: "",
  },
  errorMessage: {
    type: Array<String>,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  rows: {
    type: Number,
    default: 4,
  },
});

const emit = defineEmits(["update:modelValue", "keyEnter"]);

const inputId = computed(() => props.label.replace(/\s+/g, "-").toLowerCase());

const isError = computed(
  () => props.errorMessage && props.errorMessage.length > 0
);

const mutateValue = (event: any) => {
  emit("update:modelValue", event.target.value);
};

const onEnterPressed = () => {
  emit("keyEnter");
};
</script>

<template>
  <div>
    <p class="mb-1 font-medium">{{ props.label }}</p>
    <textarea
      :id="inputId"
      :value="props.modelValue"
      :disabled="props.disabled"
      :rows="props.rows"
      @input="mutateValue"
      @keyup.enter="onEnterPressed"
      class="relative block w-full border border-gray-200 rounded-md shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
    ></textarea>
    <div v-if="isError" class="mt-1 ml-1 space-y-1">
      <p
        v-for="(error, i) in props.errorMessage"
        :key="inputId + '-error' + i"
        class="text-sm text-red-500"
      >
        {{ `${props.label} ${error}` }}
      </p>
    </div>
  </div>
</template>

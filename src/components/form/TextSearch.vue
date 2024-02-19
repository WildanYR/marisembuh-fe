<script setup lang="ts">
import SearchIcon from "../icon/SearchIcon.vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue"]);

const handleUpdateValue = (event: any) => {
  emit("update:modelValue", event.target.value);
};
</script>

<template>
  <div>
    <div class="relative w-full">
      <div
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
      >
        <SearchIcon class="w-5 h-5 text-gray-500"></SearchIcon>
      </div>
      <input
        type="text"
        :placeholder="props.label"
        :value="props.modelValue"
        @input="handleUpdateValue"
        class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
</template>

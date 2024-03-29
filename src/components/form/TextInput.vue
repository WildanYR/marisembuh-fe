<script setup lang="ts">
import { computed, ref } from "vue";
import EyeOpen from "../icon/EyeOpen.vue";
import EyeSlash from "../icon/EyeSlash.vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
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
});

const emit = defineEmits(["update:modelValue", "keyEnter"]);

const showPassword = ref(false);

const inputId = computed(() => props.label.replace(/\s+/g, "-").toLowerCase());

const inputType = computed(() => {
  if (props.type !== "password") return props.type;
  if (showPassword.value) return "text";
  return "password";
});

const isError = computed(
  () => props.errorMessage && props.errorMessage.length > 0
);

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const mutateValue = (event: any) => {
  emit("update:modelValue", event.target.value);
};

const onEnterPressed = () => {
  emit("keyEnter");
};
</script>

<template>
  <div>
    <label
      :for="inputId"
      class="relative block border border-gray-200 rounded-md shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
    >
      <input
        :type="inputType"
        :id="inputId"
        :placeholder="props.label"
        :value="props.modelValue"
        :disabled="props.disabled"
        @input="mutateValue"
        @keyup.enter="onEnterPressed"
        class="w-full placeholder-transparent bg-transparent border-none peer focus:border-transparent focus:outline-none focus:ring-0"
      />

      <span
        class="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs"
      >
        {{ props.label }}
      </span>
      <button
        v-if="props.type == 'password'"
        class="absolute right-2 top-[0.6rem] block text-gray-400 transition-colors hover:text-blue-500"
        @click.prevent="toggleShowPassword()"
      >
        <component
          :is="showPassword ? EyeSlash : EyeOpen"
          class="w-5 h-5"
        ></component>
      </button>
    </label>
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

<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
} from "@headlessui/vue";
import { ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: 'Urutkan',
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  sortList: {
    type: Array,
    required: true
  }
});

const selected = ref('')

const emit = defineEmits(["update:modelValue", "sort"]);

const closeModal = () => {
  emit("update:modelValue", false);
};

const onSort = () => {
  if (selected.value) {
    emit("sort", selected.value);
  }
  closeModal()
};
</script>

<template>
  <TransitionRoot appear :show="props.modelValue" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-30">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-full p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-sm p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                {{ props.title }}
              </DialogTitle>
              <div class="mt-2">
                <RadioGroup v-model="selected">
                  <RadioGroupLabel class="sr-only">Server size</RadioGroupLabel>
                  <div class="space-y-2">
                    <RadioGroupOption as="template" v-for="sortList in props.sortList" :key="sortList.name"
                      :value="sortList.key" v-slot="{ active, checked }">
                      <div :class="[
                        active
                          ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-blue-300'
                          : '',
                        checked ? 'bg-blue-800 text-white ' : 'bg-white ',
                      ]"
                        class="relative flex px-5 py-3 border border-gray-300 rounded-lg cursor-pointer focus:outline-none">
                        <div class="flex items-center justify-between w-full">
                          <div class="flex items-center">
                            <div class="text-sm">
                              <RadioGroupLabel as="p" :class="checked ? 'text-white' : 'text-gray-900'"
                                class="font-medium">
                                {{ sortList.name }}
                              </RadioGroupLabel>
                            </div>
                          </div>
                          <div v-show="checked" class="text-white shrink-0">
                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="12" fill="#fff" fill-opacity="0.2" />
                              <path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </RadioGroupOption>
                  </div>
                </RadioGroup>
              </div>

              <div class="flex gap-3 mt-4">
                <button type="button"
                  class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  @click="closeModal">
                  Batal
                </button>
                <button type="button"
                  class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="onSort">
                  Urutkan
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

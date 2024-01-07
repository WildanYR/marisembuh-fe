<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import TextSearch from "./TextSearch.vue";
import { Debouncer } from "../../utils/debounce";
import LoadingSpinner from "../icon/LoadingSpinner.vue";
import EmptyData from "../EmptyData.vue";

const debouncer = new Debouncer();

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  displayKey: {
    type: String,
    required: true,
  },
  selectKey: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
  },
  modelValue: {
    required: true,
  },
  maxPage: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: Array<String>,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits([
  "update:modelValue",
  "search",
  "showMore",
  "clearSelected",
]);

const modalShow = ref(false);

const searchText = ref("");

const id = computed(() => props.label.replace(/\s+/g, "-").toLowerCase());

const selectedItemIndex = computed(() => {
  if (!props.modelValue || !props.items?.length) return -1;
  return props.items.findIndex(
    (item: any) =>
      item[props.selectKey] === (props.modelValue as any)[props.selectKey]
  );
});

const openModal = () => {
  modalShow.value = true;
};

const closeModal = () => {
  modalShow.value = false;
  debouncer.clearTimer();
};

const onSelectItem = (item: any) => {
  emit("update:modelValue", item);
  closeModal();
};

const onSearch = debouncer.debounce((searchValue: string) => {
  emit("search", searchValue);
}, 1000);
const onShowMore = () => {
  emit("showMore");
};

const onClearSelected = () => {
  emit("clearSelected");
};

onBeforeUnmount(() => {
  debouncer.clearTimer();
});
</script>

<template>
  <div>
    <p class="mb-1 font-medium">{{ props.label }}</p>
    <div class="flex gap-2">
      <button
        :disabled="props.disabled"
        @click="openModal"
        :class="[
          'flex-1 px-5 py-2 rounded-md',
          props.modelValue
            ? 'bg-emerald-100 hover:bg-emerald-300'
            : 'text-sm hover:bg-gray-200 border border-gray-300 border-dashed',
        ]"
      >
        {{
          props.modelValue
            ? (props.modelValue as any)[props.displayKey]
            : "Pilih " + props.label
        }}
      </button>
      <button
        v-show="props.modelValue"
        :disabled="props.disabled"
        @click="onClearSelected"
        class="flex-none px-3 py-2 bg-red-100 rounded-md"
      >
        X
      </button>
    </div>
    <div v-if="props.errorMessage?.length" class="mt-1 ml-1 space-y-1">
      <p
        v-for="(error, i) in props.errorMessage"
        :key="id + '-error' + i"
        class="text-sm text-red-500"
      >
        {{ `${props.label} ${error}` }}
      </p>
    </div>
  </div>
  <TransitionRoot appear :show="modalShow" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-30">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex items-center justify-center min-h-full p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-5xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                Pilih {{ props.label }}
              </DialogTitle>
              <div class="flex justify-end mb-3">
                <TextSearch
                  label="Cari"
                  v-model="searchText"
                  @update:model-value="onSearch"
                ></TextSearch>
              </div>
              <div
                v-if="props.loading"
                class="flex flex-col items-center justify-center gap-3"
              >
                <LoadingSpinner
                  class="w-8 h-8 text-gray-500 animate-spin"
                ></LoadingSpinner>
                <p class="text-lg text-gray-500">Memuat Data</p>
              </div>
              <template v-else>
                <template v-if="props.items?.length">
                  <div class="grid grid-flow-col gap-3 auto-cols-auto">
                    <button
                      v-for="(item, i) in props.items"
                      :key="id + '-' + i"
                      :disabled="selectedItemIndex === i"
                      @click="onSelectItem(item)"
                      :class="[
                        'py-2 px-3 rounded-md',
                        selectedItemIndex === i
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300',
                      ]"
                    >
                      {{ (item as any)[props.displayKey as keyof typeof item] }}
                    </button>
                  </div>
                  <div
                    v-show="!props.maxPage"
                    class="flex items-center justify-center mt-5"
                  >
                    <button
                      @click="onShowMore"
                      class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      Tampilkan lebih banyak
                    </button>
                  </div>
                </template>
                <EmptyData v-else></EmptyData>
              </template>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

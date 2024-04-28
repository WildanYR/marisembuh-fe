<script setup lang="ts">
import { Ref, computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import TextSearch from "../TextSearch.vue";
import { Debouncer } from "../../../utils/debounce";
import LoadingSpinner from "../../icon/LoadingSpinner.vue";
import EmptyData from "../../EmptyData.vue";
import {
  ITherapyResponse,
  getAllTherapyWithPagination,
  getTherapyByName,
} from "../../../services/therapy.service";
import PlusIcon from "../../icon/PlusIcon.vue";
import { IPaginationData } from "../../../types/pagination.type";
import TextInput from "../TextInput.vue";
import Pagination from "../../Pagination.vue";
import GrayButton from "../../button/GrayButton.vue";
import ChevLeftIcon from "../../icon/ChevLeftIcon.vue";
import { DEBOUNCE_TIMEOUT } from "../../../configs/debounce.config";

const debouncer = new Debouncer();

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    required: true,
  },
  modalShow: {
    type: Boolean,
    required: true,
  },
  errorMessage: {
    type: Array<String>,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue", "update:modalShow", "addData"]);

const metaValue: Ref<any[]> = ref([]);

const therapyList: Ref<ITherapyResponse[]> = ref([]);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 20,
  totalItems: 0,
  totalPage: 1,
});

const loadingGetTherapy = ref(false);

const searchText = ref("");

const id = computed(() => props.label.replace(/\s+/g, "-").toLowerCase());

const resetPaginationData = () => {
  paginationData.value.currentPage = 1;
  paginationData.value.limit = 20;
  paginationData.value.totalItems = 0;
  paginationData.value.totalPage = 1;
};

const getTherapy = (page = 1, limit = 20) => {
  loadingGetTherapy.value = true;
  getAllTherapyWithPagination({ page, limit })
    .then((response) => {
      if (!response) return [];
      therapyList.value = response.items;
      paginationData.value.currentPage = response.paginationData.currentPage;
      paginationData.value.limit = response.paginationData.limit;
      paginationData.value.totalItems = response.paginationData.totalItems;
      paginationData.value.totalPage = response.paginationData.totalPage;
    })
    .finally(() => {
      loadingGetTherapy.value = false;
    });
};

const isItemSelected = (id: number) => {
  if (!(props.modelValue as any)?.length || !therapyList.value.length)
    return false;
  const selectedIndex = (props.modelValue as any[]).findIndex(
    (item) => item.id === id
  );
  return selectedIndex !== -1;
};

const openModal = () => {
  emit("update:modalShow", true);
};

const closeModal = () => {
  emit("update:modalShow", false);
  debouncer.clearTimer();
};

const onSelectItem = (selectedItem: any) => {
  if (metaValue.value.length) {
    const selectedIndex = metaValue.value.findIndex(
      (item) => item.id === selectedItem.id
    );
    if (selectedIndex === -1) {
      metaValue.value.push({ ...selectedItem, detail: "" });
    } else {
      metaValue.value = metaValue.value.filter((_, i) => i !== selectedIndex);
    }
  } else {
    metaValue.value.push({ ...selectedItem, detail: "" });
  }
  emit("update:modelValue", [...metaValue.value]);
};

const onClearSelected = (itemIndex: number) => {
  metaValue.value = metaValue.value.filter((_, i) => i !== itemIndex);
  emit("update:modelValue", [...metaValue.value]);
};

const onDetailInput = (itemIndex: number, detail: string) => {
  metaValue.value[itemIndex].detail = detail;
  emit("update:modelValue", [...metaValue.value]);
};

const onSearch = debouncer.debounce((searchValue: string) => {
  resetPaginationData();
  if (!searchValue) {
    getTherapy();
  } else {
    loadingGetTherapy.value = true;
    getTherapyByName(searchValue)
      .then((response) => {
        if (!response) return [];
        therapyList.value = response;
      })
      .finally(() => {
        loadingGetTherapy.value = false;
      });
  }
}, DEBOUNCE_TIMEOUT);

const handleOnAddData = () => {
  emit("addData");
};

const syncMetavalue = () => {
  if ((props.modelValue as any)?.length) {
    metaValue.value = props.modelValue as any;
  }
};

watch(
  () => props.modelValue,
  () => {
    syncMetavalue();
  }
);

onMounted(() => {
  getTherapy();
  syncMetavalue();
});

onBeforeUnmount(() => {
  debouncer.clearTimer();
});
</script>

<template>
  <div>
    <p class="mb-1 font-medium">{{ props.label }}</p>
    <div v-if="(props.modelValue as any)?.length" class="flex flex-col gap-3">
      <div
        v-for="(value, i) in props.modelValue"
        :key="id + '-selected-' + i"
        class="space-y-2"
      >
        <div class="flex gap-2">
          <button
            :disabled="props.disabled"
            @click="openModal"
            class="flex-1 px-5 py-2 rounded-md bg-emerald-100 enabled:hover:bg-emerald-300"
          >
            {{ (value as any).name }}
          </button>
          <button
            v-show="!props.disabled"
            :disabled="props.disabled"
            @click="onClearSelected(i)"
            class="flex-none px-3 py-2 bg-red-100 rounded-md"
          >
            X
          </button>
        </div>
        <TextInput
          label="Keterangan"
          :model-value="(value as any).detail"
          :disabled="props.disabled"
          @update:model-value="(value) => onDetailInput(i, value)"
        ></TextInput>
      </div>
    </div>
    <template v-else>
      <button
        v-if="!props.disabled"
        @click="openModal"
        class="w-full px-5 py-2 text-sm border border-gray-300 border-dashed rounded-md hover:bg-gray-200"
      >
        {{ "Pilih " + props.label }}
      </button>
      <p v-else class="text-sm text-gray-500">Tidak ada data</p>
    </template>
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
  <TransitionRoot appear :show="props.modalShow" as="template">
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
              <div
                class="flex flex-col items-start justify-start gap-4 mb-4 md:items-center md:justify-between md:flex-row"
              >
                <div class="flex items-center justify-start gap-3">
                  <GrayButton
                    @click="closeModal"
                    class="flex items-center justify-center !px-3"
                  >
                    <ChevLeftIcon class="w-5 h-5" />
                  </GrayButton>
                  <DialogTitle
                    as="h3"
                    class="text-lg font-medium leading-6 text-gray-900"
                  >
                    Pilih {{ props.label }}
                  </DialogTitle>
                </div>
                <button
                  type="button"
                  @click="handleOnAddData"
                  class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg md:w-max hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                >
                  <PlusIcon class="w-4 h-4"></PlusIcon>
                  <span>Tambah Terapi (Tindakan)</span>
                </button>
              </div>
              <div class="flex items-center justify-center mb-4 md:justify-end">
                <TextSearch
                  label="Cari"
                  v-model="searchText"
                  @update:model-value="onSearch"
                  class="w-full md:w-max"
                ></TextSearch>
              </div>
              <div
                v-if="loadingGetTherapy"
                class="flex flex-col items-center justify-center gap-3"
              >
                <LoadingSpinner
                  class="w-8 h-8 text-gray-500 animate-spin"
                ></LoadingSpinner>
                <p class="text-lg text-gray-500">Memuat Data</p>
              </div>
              <template v-else-if="therapyList.length">
                <div
                  class="grid grid-cols-1 gap-3 lg:grid-cols-4 md:grid-cols-2"
                >
                  <button
                    v-for="(item, i) in therapyList"
                    :key="id + '-' + i"
                    @click="onSelectItem(item)"
                    :class="[
                      'py-2 px-3 rounded-md',
                      isItemSelected(item.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300',
                    ]"
                  >
                    {{ item.name }}
                  </button>
                </div>
                <div class="mt-5">
                  <Pagination
                    :current-page="paginationData.currentPage"
                    :total-pages="paginationData.totalPage"
                    :total-items="paginationData.totalItems"
                    :limit="paginationData.limit"
                    @page-change="getTherapy"
                  ></Pagination>
                </div>
              </template>
              <EmptyData v-else></EmptyData>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

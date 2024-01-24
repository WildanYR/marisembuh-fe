<script setup lang="ts">
import { Ref, computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
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
  ITongueCheckupResponse,
  getAllTongueCheckupWithPagination,
  getTongueCheckupByName,
  createTongueCheckup,
} from "../../../services/tongue_checkup.service";
import PlusIcon from "../../icon/PlusIcon.vue";
import { IPaginationData } from "../../../types/pagination.type";
import TextInput from "../TextInput.vue";
import { Validator } from "../../../validator";
import isRequired from "../../../validator/isRequired.validator";
import LoadingButton from "../../LoadingButton.vue";
import Pagination from "../../Pagination.vue";
import GrayButton from "../../button/GrayButton.vue";
import ChevLeftIcon from "../../icon/ChevLeftIcon.vue";

const debouncer = new Debouncer();

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
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
const emit = defineEmits(["update:modelValue"]);

const tonguecheckupList: Ref<ITongueCheckupResponse[]> = ref([]);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 20,
  totalItems: 0,
  totalPage: 1,
});

const addTongueCheckupData = reactive({
  name: "",
});
const addTongueCheckupDataError = reactive({
  name: [],
});

const loadingGetTongueCheckup = ref(false);
const loadingAddTongueCheckup = ref(false);

const modalShow = ref(false);
const mode = ref("get");
const searchText = ref("");

const id = computed(() => props.label.replace(/\s+/g, "-").toLowerCase());

const resetPaginationData = () => {
  paginationData.value.currentPage = 1;
  paginationData.value.limit = 20;
  paginationData.value.totalItems = 0;
  paginationData.value.totalPage = 1;
};

const getTongueCheckup = (page = 1, limit = 20) => {
  loadingGetTongueCheckup.value = true;
  getAllTongueCheckupWithPagination({ page, limit })
    .then((response) => {
      if (!response) return [];
      tonguecheckupList.value = response.items;
      paginationData.value.currentPage = response.paginationData.currentPage;
      paginationData.value.limit = response.paginationData.limit;
      paginationData.value.totalItems = response.paginationData.totalItems;
      paginationData.value.totalPage = response.paginationData.totalPage;
    })
    .finally(() => {
      loadingGetTongueCheckup.value = false;
    });
};

const isItemSelected = (id: number) => {
  if (!(props.modelValue as any)?.length || !tonguecheckupList.value.length)
    return false;
  const selectedIndex = (props.modelValue as any[]).findIndex(
    (item) => item.id === id
  );
  return selectedIndex !== -1;
};

const openModal = () => {
  modalShow.value = true;
};

const closeModal = () => {
  if (loadingAddTongueCheckup.value) return;
  modalShow.value = false;
  debouncer.clearTimer();
};

const onSelectItem = (selectedItem: any) => {
  if ((props.modelValue as any[])?.length) {
    let newValue = (props.modelValue as any[]).map((item) => item);
    const selectedIndex = newValue.findIndex(
      (item) => item.id === selectedItem.id
    );
    if (selectedIndex === -1) {
      newValue.push(selectedItem);
    } else {
      newValue = newValue.filter((_, i) => i !== selectedIndex);
    }
    emit("update:modelValue", newValue);
  } else {
    emit("update:modelValue", [selectedItem]);
  }
};

const onClearSelected = (itemIndex: number) => {
  const newValue = [...(props.modelValue as any[])];
  newValue.splice(itemIndex, 1);
  emit("update:modelValue", newValue);
};

const onSearch = debouncer.debounce((searchValue: string) => {
  resetPaginationData();
  if (!searchValue) {
    getTongueCheckup();
  } else {
    loadingGetTongueCheckup.value = true;
    getTongueCheckupByName(searchValue)
      .then((response) => {
        if (!response) return [];
        tonguecheckupList.value = response;
      })
      .finally(() => {
        loadingGetTongueCheckup.value = false;
      });
  }
}, 1000);

const onAddTongueCheckupMode = () => {
  mode.value = "add";
};
const onGetTongueCheckupMode = () => {
  mode.value = "get";
  resetPaginationData();
  getTongueCheckup();
};

const handleAddTongueCheckup = () => {
  const validator = new Validator();
  validator.addValidation("name", addTongueCheckupData.name, [isRequired]);
  if (validator.validate()) {
    addTongueCheckupDataError.name = validator.getError("name") as any;
    return;
  }
  loadingAddTongueCheckup.value = true;
  createTongueCheckup({ ...addTongueCheckupData })
    .then((response) => {
      if (!response) return;
      onSelectItem(response);
      addTongueCheckupData.name = "";
      loadingAddTongueCheckup.value = false;
      mode.value = "get";
      resetPaginationData();
      getTongueCheckup();
    })
    .finally(() => {
      loadingAddTongueCheckup.value = false;
    });
};

onMounted(() => {
  getTongueCheckup();
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
        class="flex gap-2"
      >
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
                  @click="onAddTongueCheckupMode"
                  v-show="mode !== 'add'"
                  class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg md:w-max hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  <PlusIcon class="w-4 h-4"></PlusIcon>
                  <span>Tambah Pemeriksaan Lidah</span>
                </button>
              </div>
              <div class="flex items-center justify-center mb-4 md:justify-end">
                <TextSearch
                  label="Cari"
                  v-show="mode !== 'add'"
                  v-model="searchText"
                  @update:model-value="onSearch"
                  class="w-full md:w-max"
                ></TextSearch>
              </div>
              <div
                v-if="loadingGetTongueCheckup"
                class="flex flex-col items-center justify-center gap-3"
              >
                <LoadingSpinner
                  class="w-8 h-8 text-gray-500 animate-spin"
                ></LoadingSpinner>
                <p class="text-lg text-gray-500">Memuat Data</p>
              </div>
              <template v-else>
                <template v-if="mode === 'add'">
                  <div class="flex flex-col items-center justify-center gap-4">
                    <TextInput
                      v-model="addTongueCheckupData.name"
                      label="Nama Pemeriksaan Lidah"
                      :error-message="addTongueCheckupDataError.name"
                      class="w-full"
                    ></TextInput>
                    <LoadingButton
                      :loading="loadingAddTongueCheckup"
                      @click="handleAddTongueCheckup"
                      class="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-blue-200 disabled:text-blue-600"
                    >
                      Tambah Pemeriksaan Lidah
                    </LoadingButton>
                    <GrayButton @click="onGetTongueCheckupMode" class="w-full"
                      >batal</GrayButton
                    >
                  </div>
                </template>
                <template v-else>
                  <template v-if="tonguecheckupList.length">
                    <div
                      class="grid grid-cols-1 gap-3 lg:grid-cols-4 md:grid-cols-2"
                    >
                      <button
                        v-for="(item, i) in tonguecheckupList"
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
                        @page-change="getTongueCheckup"
                      ></Pagination>
                    </div>
                  </template>
                  <EmptyData v-else></EmptyData>
                </template>
              </template>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

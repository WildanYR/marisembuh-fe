<script setup lang="ts">
import { Ref, computed, onBeforeUnmount, onMounted, ref } from "vue";
import PlusIcon from "../../components/icon/PlusIcon.vue";
import {
  IDurationAdviceResponse,
  deleteDurationAdvice,
  getAllDurationAdviceWithPagination,
  getDurationAdviceByName,
} from "../../services/duration_advice.service";
import { IPaginationData } from "../../types/pagination.type";
import ResponsiveTable from "../../components/tables/ResponsiveTable.vue";
import TableHead from "../../components/tables/TableHead.vue";
import TableRowBody from "../../components/tables/TableRowBody.vue";
import TableBody from "../../components/tables/TableBody.vue";
import Pagination from "../../components/Pagination.vue";
import EmptyData from "../../components/EmptyData.vue";
import { useRoute, useRouter } from "vue-router";
import TextSearch from "../../components/form/TextSearch.vue";
import ConfirmDialog from "../../components/dialog/ConfirmDialog.vue";
import GrayButton from "../../components/button/GrayButton.vue";
import ChevLeftIcon from "../../components/icon/ChevLeftIcon.vue";
import { Debouncer } from "../../utils/debounce";
import { DEBOUNCE_TIMEOUT } from "../../configs/debounce.config";
import LoadingSpinner from "../../components/icon/LoadingSpinner.vue";

const debouncer = new Debouncer();
const router = useRouter();
const route = useRoute();

const DurationAdvices: Ref<IDurationAdviceResponse[]> = ref([]);
const selectedDurationAdvice: Ref<IDurationAdviceResponse | null> = ref(null);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const searchQuery = ref("");
const loadingGetDurationAdvice = ref(false);
const loadingDeleteDurationAdvice = ref(false);
const modalDeleteOpen = ref(false);

const tableData = computed(() => {
  if (!DurationAdvices.value.length) return null;
  const row = DurationAdvices.value.map((DurationAdvice) => {
    return [DurationAdvice.name];
  });
  return {
    header: ["Nama"],
    row,
  };
});

const resetPaginationData = () => {
  paginationData.value.currentPage = 1;
  paginationData.value.limit = 10;
  paginationData.value.totalItems = 0;
  paginationData.value.totalPage = 1;
};

const getDurationAdviceData = (page = 1, limit = 10) => {
  loadingGetDurationAdvice.value = true;
  getAllDurationAdviceWithPagination({ page, limit })
    .then((response) => {
      if (!response) return;
      DurationAdvices.value = response.items;
      paginationData.value = response.paginationData;
    })
    .finally(() => {
      loadingGetDurationAdvice.value = false;
    });
};

const getDurationAdviceDataByQuery = () => {
  resetPaginationData();
  if (!searchQuery.value) {
    getDurationAdviceData();
    return;
  }
  loadingGetDurationAdvice.value = true;
  getDurationAdviceByName(searchQuery.value)
    .then((response) => {
      if (!response) return;
      DurationAdvices.value = response;
    })
    .finally(() => {
      loadingGetDurationAdvice.value = false;
    });
};

const handleOnDurationAdviceAdd = () => {
  router.push({ name: "DurationAdviceAdd" });
};

const handleOnDurationAdviceEdit = (DurationAdviceId: number) => {
  router.push({
    name: "DurationAdviceEdit",
    params: { id: DurationAdviceId },
  });
};

const handleOnDurationAdviceDelete = () => {
  loadingDeleteDurationAdvice.value = true;
  deleteDurationAdvice(selectedDurationAdvice.value!.id)
    .then(() => {
      getDurationAdviceData(
        paginationData.value.currentPage,
        paginationData.value.limit
      );
    })
    .finally(() => {
      loadingDeleteDurationAdvice.value = false;
      modalDeleteOpen.value = false;
    });
};

const openDeleteModal = (DurationAdviceId: number) => {
  selectedDurationAdvice.value = DurationAdvices.value.find(
    (DurationAdvice) => DurationAdvice.id === DurationAdviceId
  )!;
  modalDeleteOpen.value = true;
};

const toPreviousPage = () => {
  router.push({ name: "Home" });
};

const onSearch = debouncer.debounce(() => {
  getDurationAdviceDataByQuery();
}, DEBOUNCE_TIMEOUT);

const handlePaginationChange = (page: number) => {
  router.replace({ query: { ...route.query, page } });
  getDurationAdviceData(page);
};

onMounted(() => {
  let page = 1;
  if (route.query.page) {
    page = parseInt(route.query.page as string);
  }

  getDurationAdviceData(page);
});

onBeforeUnmount(() => {
  debouncer.clearTimer();
});
</script>

<template>
  <div class="p-8 bg-white rounded-lg">
    <div
      class="flex flex-col items-start justify-start gap-4 lg:items-center lg:flex-row lg:justify-between"
    >
      <div class="flex gap-3">
        <GrayButton
          @click="toPreviousPage"
          class="flex items-center justify-center !px-3"
        >
          <ChevLeftIcon class="w-5 h-5" />
        </GrayButton>
        <h1 class="text-2xl font-medium">Daftar Saran Perawatan</h1>
      </div>
      <button
        type="button"
        @click="handleOnDurationAdviceAdd"
        class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg lg:w-max hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
      >
        <PlusIcon class="w-4 h-4"></PlusIcon>
        <span>Tambah Saran Perawatan</span>
      </button>
    </div>
    <div class="mt-5">
      <div class="flex justify-end gap-2 mb-3">
        <!-- search bar -->
        <TextSearch
          label="Cari nama"
          v-model="searchQuery"
          @update:model-value="onSearch"
          class="w-full lg:w-max"
        />
      </div>
      <div
        v-if="loadingGetDurationAdvice"
        class="flex flex-col items-center justify-center gap-3"
      >
        <LoadingSpinner
          class="w-8 h-8 text-gray-500 animate-spin"
        ></LoadingSpinner>
        <p class="text-lg text-gray-500">Memuat Data</p>
      </div>
      <!-- table -->
      <div v-else-if="DurationAdvices.length">
        <ResponsiveTable v-if="tableData">
          <template v-slot:header>
            <TableHead
              v-for="(header, i) in tableData.header"
              :key="'DurationAdvice-table-header' + i"
            >
              {{ header }}
            </TableHead>
            <TableHead>Aksi</TableHead>
          </template>
          <template v-slot:body>
            <TableRowBody
              v-for="(row, i) in tableData.row"
              :key="'DurationAdvice-table-row-' + i"
            >
              <TableBody
                v-for="(col, j) in row"
                :key="'DurationAdvice-table-col-' + j"
                >{{ col }}
              </TableBody>
              <TableBody class="flex items-center gap-3">
                <button
                  @click="handleOnDurationAdviceEdit(DurationAdvices[i].id)"
                  class="flex items-center gap-1 px-4 py-1 text-sm rounded-md text-amber-900 bg-amber-100 hover:bg-amber-200 group"
                >
                  Edit
                </button>
                <button
                  @click="openDeleteModal(DurationAdvices[i].id)"
                  class="flex items-center gap-1 px-4 py-1 text-sm text-red-900 bg-red-100 rounded-md hover:bg-red-200 group"
                >
                  Hapus
                </button>
              </TableBody>
            </TableRowBody>
          </template>
        </ResponsiveTable>
        <Pagination
          :current-page="paginationData.currentPage"
          :total-pages="paginationData.totalPage"
          :total-items="paginationData.totalItems"
          :limit="paginationData.limit"
          @page-change="handlePaginationChange"
        ></Pagination>
      </div>
      <EmptyData v-else></EmptyData>
    </div>
  </div>
  <ConfirmDialog
    v-model="modalDeleteOpen"
    title="Hapus Saran Perawatan"
    button-text="Hapus"
    :loading-confirm="loadingDeleteDurationAdvice"
    @confirm="handleOnDurationAdviceDelete"
  >
    konfirmasi untuk menghapus,
    <span class="font-medium">{{ selectedDurationAdvice?.name }}</span>
  </ConfirmDialog>
</template>

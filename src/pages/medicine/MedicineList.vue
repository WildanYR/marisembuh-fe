<script setup lang="ts">
import { Ref, computed, onBeforeUnmount, onMounted, ref } from "vue";
import PlusIcon from "../../components/icon/PlusIcon.vue";
import {
  IMedicineResponse,
  deleteMedicine,
  getAllMedicineWithPagination,
  getMedicineByName,
} from "../../services/medicine.service";
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

const Medicines: Ref<IMedicineResponse[]> = ref([]);
const selectedMedicine: Ref<IMedicineResponse | null> = ref(null);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const searchQuery = ref("");
const loadingGetMedicine = ref(false);
const loadingDeleteMedicine = ref(false);
const modalDeleteOpen = ref(false);

const tableData = computed(() => {
  if (!Medicines.value.length) return null;
  const row = Medicines.value.map((Medicine) => {
    return [Medicine.name];
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

const getMedicineData = (page = 1, limit = 10) => {
  loadingGetMedicine.value = true;
  getAllMedicineWithPagination({ page, limit })
    .then((response) => {
      if (!response) return;
      Medicines.value = response.items;
      paginationData.value = response.paginationData;
    })
    .finally(() => {
      loadingGetMedicine.value = false;
    });
};

const getMedicineDataByQuery = () => {
  resetPaginationData();
  if (!searchQuery.value) {
    getMedicineData();
    return;
  }
  loadingGetMedicine.value = true;
  getMedicineByName(searchQuery.value)
    .then((response) => {
      if (!response) return;
      Medicines.value = response;
    })
    .finally(() => {
      loadingGetMedicine.value = false;
    });
};

const handleOnMedicineAdd = () => {
  router.push({ name: "MedicineAdd" });
};

const handleOnMedicineEdit = (MedicineId: number) => {
  router.push({ name: "MedicineEdit", params: { id: MedicineId } });
};

const handleOnMedicineDelete = () => {
  loadingDeleteMedicine.value = true;
  deleteMedicine(selectedMedicine.value!.id)
    .then(() => {
      getMedicineData(
        paginationData.value.currentPage,
        paginationData.value.limit
      );
    })
    .finally(() => {
      loadingDeleteMedicine.value = false;
      modalDeleteOpen.value = false;
    });
};

const openDeleteModal = (MedicineId: number) => {
  selectedMedicine.value = Medicines.value.find(
    (Medicine) => Medicine.id === MedicineId
  )!;
  modalDeleteOpen.value = true;
};

const toPreviousPage = () => {
  router.push({ name: "Home" });
};

const onSearch = debouncer.debounce(() => {
  getMedicineDataByQuery();
}, DEBOUNCE_TIMEOUT);

const handlePaginationChange = (page: number) => {
  router.replace({ query: { ...route.query, page } });
  getMedicineData(page);
};

onMounted(() => {
  let page = 1;
  if (route.query.page) {
    page = parseInt(route.query.page as string);
  }

  getMedicineData(page);
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
        <h1 class="text-2xl font-medium">Daftar Obat</h1>
      </div>
      <button
        type="button"
        @click="handleOnMedicineAdd"
        class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg lg:w-max hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
      >
        <PlusIcon class="w-4 h-4"></PlusIcon>
        <span>Tambah Obat</span>
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
        v-if="loadingGetMedicine"
        class="flex flex-col items-center justify-center gap-3"
      >
        <LoadingSpinner
          class="w-8 h-8 text-gray-500 animate-spin"
        ></LoadingSpinner>
        <p class="text-lg text-gray-500">Memuat Data</p>
      </div>
      <!-- table -->
      <div v-else-if="Medicines.length">
        <ResponsiveTable v-if="tableData">
          <template v-slot:header>
            <TableHead
              v-for="(header, i) in tableData.header"
              :key="'Medicine-table-header' + i"
            >
              {{ header }}
            </TableHead>
            <TableHead>Aksi</TableHead>
          </template>
          <template v-slot:body>
            <TableRowBody
              v-for="(row, i) in tableData.row"
              :key="'Medicine-table-row-' + i"
            >
              <TableBody
                v-for="(col, j) in row"
                :key="'Medicine-table-col-' + j"
                >{{ col }}
              </TableBody>
              <TableBody class="flex items-center gap-3">
                <button
                  @click="handleOnMedicineEdit(Medicines[i].id)"
                  class="flex items-center gap-1 px-4 py-1 text-sm rounded-md text-amber-900 bg-amber-100 hover:bg-amber-200 group"
                >
                  Edit
                </button>
                <button
                  @click="openDeleteModal(Medicines[i].id)"
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
    title="Hapus Obat"
    button-text="Hapus"
    :loading-confirm="loadingDeleteMedicine"
    @confirm="handleOnMedicineDelete"
  >
    konfirmasi untuk menghapus,
    <span class="font-medium">{{ selectedMedicine?.name }}</span>
  </ConfirmDialog>
</template>

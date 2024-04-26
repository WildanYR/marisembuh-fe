<script setup lang="ts">
import { Ref, computed, onBeforeUnmount, onMounted, ref } from "vue";
import PlusIcon from "../../components/icon/PlusIcon.vue";
import {
  IDoctorDiagnosisResponse,
  deleteDoctorDiagnosis,
  getAllDoctorDiagnosisWithPagination,
  getDoctorDiagnosisByName,
} from "../../services/doctor_diagnosis.service";
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

const debouncer = new Debouncer();
const router = useRouter();
const route = useRoute();

const DoctorDiagnosiss: Ref<IDoctorDiagnosisResponse[]> = ref([]);
const selectedDoctorDiagnosis: Ref<IDoctorDiagnosisResponse | null> = ref(null);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const searchQuery = ref("");
const loadingDoctorDiagnosis = ref(false);
const loadingDeleteDoctorDiagnosis = ref(false);
const modalDeleteOpen = ref(false);

const tableData = computed(() => {
  if (!DoctorDiagnosiss.value.length) return null;
  const row = DoctorDiagnosiss.value.map((DoctorDiagnosis) => {
    return [DoctorDiagnosis.name];
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

const getDoctorDiagnosisData = (page = 1, limit = 10) => {
  loadingDoctorDiagnosis.value = true;
  getAllDoctorDiagnosisWithPagination({ page, limit })
    .then((response) => {
      if (!response) return;
      DoctorDiagnosiss.value = response.items;
      paginationData.value = response.paginationData;
    })
    .finally(() => {
      loadingDoctorDiagnosis.value = false;
    });
};

const getDoctorDiagnosisDataByQuery = () => {
  resetPaginationData();
  if (!searchQuery.value) {
    getDoctorDiagnosisData();
    return;
  }
  loadingDoctorDiagnosis.value = true;
  getDoctorDiagnosisByName(searchQuery.value)
    .then((response) => {
      if (!response) return;
      DoctorDiagnosiss.value = response;
    })
    .finally(() => {
      loadingDoctorDiagnosis.value = false;
    });
};

const handleOnDoctorDiagnosisAdd = () => {
  router.push({ name: "DoctorDiagnosisAdd" });
};

const handleOnDoctorDiagnosisEdit = (DoctorDiagnosisId: number) => {
  router.push({
    name: "DoctorDiagnosisEdit",
    params: { id: DoctorDiagnosisId },
  });
};

const handleOnDoctorDiagnosisDelete = () => {
  loadingDeleteDoctorDiagnosis.value = true;
  deleteDoctorDiagnosis(selectedDoctorDiagnosis.value!.id)
    .then(() => {
      getDoctorDiagnosisData(
        paginationData.value.currentPage,
        paginationData.value.limit
      );
    })
    .finally(() => {
      loadingDeleteDoctorDiagnosis.value = false;
      modalDeleteOpen.value = false;
    });
};

const openDeleteModal = (DoctorDiagnosisId: number) => {
  selectedDoctorDiagnosis.value = DoctorDiagnosiss.value.find(
    (DoctorDiagnosis) => DoctorDiagnosis.id === DoctorDiagnosisId
  )!;
  modalDeleteOpen.value = true;
};

const toPreviousPage = () => {
  router.push({ name: "Home" });
};

const onSearch = debouncer.debounce(() => {
  getDoctorDiagnosisDataByQuery();
}, DEBOUNCE_TIMEOUT);

const handlePaginationChange = (page: number) => {
  router.replace({ query: { ...route.query, page } });
  getDoctorDiagnosisData(page);
};

onMounted(() => {
  let page = 1;
  if (route.query.page) {
    page = parseInt(route.query.page as string);
  }

  getDoctorDiagnosisData(page);
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
        <h1 class="text-2xl font-medium">Daftar Diagnosa Dokter</h1>
      </div>
      <button
        type="button"
        @click="handleOnDoctorDiagnosisAdd"
        class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg lg:w-max hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
      >
        <PlusIcon class="w-4 h-4"></PlusIcon>
        <span>Tambah Diagnosa Dokter</span>
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
      <!-- table -->
      <div v-if="DoctorDiagnosiss.length">
        <ResponsiveTable v-if="tableData">
          <template v-slot:header>
            <TableHead
              v-for="(header, i) in tableData.header"
              :key="'DoctorDiagnosis-table-header' + i"
            >
              {{ header }}
            </TableHead>
            <TableHead>Aksi</TableHead>
          </template>
          <template v-slot:body>
            <TableRowBody
              v-for="(row, i) in tableData.row"
              :key="'DoctorDiagnosis-table-row-' + i"
            >
              <TableBody
                v-for="(col, j) in row"
                :key="'DoctorDiagnosis-table-col-' + j"
                >{{ col }}
              </TableBody>
              <TableBody class="flex items-center gap-3">
                <button
                  @click="handleOnDoctorDiagnosisEdit(DoctorDiagnosiss[i].id)"
                  class="flex items-center gap-1 px-4 py-1 text-sm rounded-md text-amber-900 bg-amber-100 hover:bg-amber-200 group"
                >
                  Edit
                </button>
                <button
                  @click="openDeleteModal(DoctorDiagnosiss[i].id)"
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
    title="Hapus Diagnosa Dokter"
    button-text="Hapus"
    :loading-confirm="loadingDeleteDoctorDiagnosis"
    @confirm="handleOnDoctorDiagnosisDelete"
  >
    konfirmasi untuk menghapus,
    <span class="font-medium">{{ selectedDoctorDiagnosis?.name }}</span>
  </ConfirmDialog>
</template>

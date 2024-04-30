<script setup lang="ts">
import { Ref, computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  IClinicResponse,
  getAllClinicWithPagination,
  getClinicByName,
} from "../../../services/clinic.service";
import { IPaginationData } from "../../../types/pagination.type";
import ResponsiveTable from "../../../components/tables/ResponsiveTable.vue";
import TableHead from "../../../components/tables/TableHead.vue";
import TableRowBody from "../../../components/tables/TableRowBody.vue";
import TableBody from "../../../components/tables/TableBody.vue";
import Pagination from "../../../components/Pagination.vue";
import EmptyData from "../../../components/EmptyData.vue";
import { useRoute, useRouter } from "vue-router";
import TextSearch from "../../../components/form/TextSearch.vue";
import GrayButton from "../../../components/button/GrayButton.vue";
import ChevLeftIcon from "../../../components/icon/ChevLeftIcon.vue";
import { Debouncer } from "../../../utils/debounce";
import { DEBOUNCE_TIMEOUT } from "../../../configs/debounce.config";
import LoadingSpinner from "../../../components/icon/LoadingSpinner.vue";

const debouncer = new Debouncer();
const router = useRouter();
const route = useRoute();

const clinics: Ref<IClinicResponse[]> = ref([]);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const searchQuery = ref("");
const loadingGetClinic = ref(false);

const tableData = computed(() => {
  if (!clinics.value.length) return null;
  const row = clinics.value.map((Clinic) => {
    return [Clinic.name];
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

const getClinicData = (page = 1, limit = 10) => {
  loadingGetClinic.value = true;
  getAllClinicWithPagination({ page, limit })
    .then((response) => {
      if (!response) return;
      clinics.value = response.items;
      paginationData.value = response.paginationData;
    })
    .finally(() => {
      loadingGetClinic.value = false;
    });
};

const getClinicDataByQuery = () => {
  resetPaginationData();
  if (!searchQuery.value) {
    getClinicData();
    return;
  }
  loadingGetClinic.value = true;
  getClinicByName(searchQuery.value)
    .then((response) => {
      if (!response) return;
      clinics.value = response;
    })
    .finally(() => {
      loadingGetClinic.value = false;
    });
};

const handleOnClinicSelect = (clinicId: number) => {
  router.push({
    name: "TAClinicTreatmentList",
    params: { clinicId },
  });
};

const toPreviousPage = () => {
  router.push({ name: "TreatmentAnalyticList" });
};

const onSearch = debouncer.debounce(() => {
  getClinicDataByQuery();
}, DEBOUNCE_TIMEOUT);

const handlePaginationChange = (page: number) => {
  router.replace({ query: { ...route.query, page } });
  getClinicData(page);
};

onMounted(() => {
  let page = 1;
  if (route.query.page) {
    page = parseInt(route.query.page as string);
  }

  getClinicData(page);
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
        <div>
          <h1 class="text-2xl font-medium">Daftar Klinik</h1>
          <p class="text-sm text-gray-500">Analisis Perawatan</p>
        </div>
      </div>
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
        v-if="loadingGetClinic"
        class="flex flex-col items-center justify-center gap-3"
      >
        <LoadingSpinner
          class="w-8 h-8 text-gray-500 animate-spin"
        ></LoadingSpinner>
        <p class="text-lg text-gray-500">Memuat Data</p>
      </div>
      <!-- table -->
      <div v-else-if="clinics.length">
        <ResponsiveTable v-if="tableData">
          <template v-slot:header>
            <TableHead>Aksi</TableHead>
            <TableHead
              v-for="(header, i) in tableData.header"
              :key="'clinic-table-header' + i"
            >
              {{ header }}
            </TableHead>
          </template>
          <template v-slot:body>
            <TableRowBody
              v-for="(row, i) in tableData.row"
              :key="'clinic-table-row-' + i"
            >
              <TableBody>
                <button
                  @click="handleOnClinicSelect(clinics[i].id)"
                  class="px-4 py-1 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-blue-200 disabled:text-blue-600"
                >
                  Pilih
                </button>
              </TableBody>
              <TableBody v-for="(col, j) in row" :key="'clinic-table-col-' + j"
                >{{ col }}
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
</template>

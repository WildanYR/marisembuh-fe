<script setup lang="ts">
import { Ref, computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  IPatientResponse,
  getAllPatientWithPagination,
  getPatientByName,
} from "../../../services/patient.service";
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
import { calculateAgeFromBirthdate } from "../../../utils/date.util";

const debouncer = new Debouncer();
const router = useRouter();
const route = useRoute();

const patients: Ref<IPatientResponse[]> = ref([]);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const searchQuery = ref("");
const loadingPatient = ref(false);

const tableData = computed(() => {
  if (!patients.value.length) return null;
  const row = patients.value.map((patient) => {
    let patientAge = "";
    if (patient.birthdate) {
      patientAge = calculateAgeFromBirthdate(patient.birthdate).toString();
    }
    return [
      patient.no_rm,
      patient.name,
      patient.gender === "L" ? "Laki-laki" : "Perempuan",
      patientAge,
      patient.address,
    ];
  });
  return {
    header: ["No RM", "Nama", "Gender", "Umur", "Alamat"],
    row,
  };
});

const resetPaginationData = () => {
  paginationData.value.currentPage = 1;
  paginationData.value.limit = 10;
  paginationData.value.totalItems = 0;
  paginationData.value.totalPage = 1;
};

const getPatientData = (page = 1, limit = 10) => {
  loadingPatient.value = true;
  getAllPatientWithPagination({ page, limit })
    .then((response) => {
      if (!response) return;
      patients.value = response.items;
      paginationData.value = response.paginationData;
    })
    .finally(() => {
      loadingPatient.value = false;
    });
};

const getPatientDataByQuery = () => {
  resetPaginationData();
  if (!searchQuery.value) {
    getPatientData();
    return;
  }
  loadingPatient.value = true;
  getPatientByName(searchQuery.value)
    .then((response) => {
      if (!response) return;
      patients.value = response;
    })
    .finally(() => {
      loadingPatient.value = false;
    });
};

const handleOnPatientSelect = (patientId: number) => {
  router.push({
    name: "TAPatientTreatmentList",
    params: { patientId },
  });
};

const toPreviousPage = () => {
  router.push({ name: "TreatmentAnalyticList" });
};

const onSearch = debouncer.debounce(() => {
  getPatientDataByQuery();
}, DEBOUNCE_TIMEOUT);

const handlePaginationChange = (page: number) => {
  router.replace({ query: { ...route.query, page } });
  getPatientData(page);
};

onMounted(() => {
  let page = 1;
  if (route.query.page) {
    page = parseInt(route.query.page as string);
  }

  getPatientData(page);
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
          <h1 class="text-2xl font-medium">Daftar Pasien</h1>
          <p class="text-sm text-gray-500">Analisis Perawatan</p>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <div class="flex justify-end gap-2 mb-3">
        <!-- search bar -->
        <TextSearch
          label="Cari nama, No RM"
          v-model="searchQuery"
          @update:model-value="onSearch"
          class="w-full lg:w-max"
        />
      </div>
      <!-- table -->
      <div v-if="patients.length">
        <ResponsiveTable v-if="tableData">
          <template v-slot:header>
            <TableHead>Aksi</TableHead>
            <TableHead
              v-for="(header, i) in tableData.header"
              :key="'patient-table-header' + i"
            >
              {{ header }}
            </TableHead>
          </template>
          <template v-slot:body>
            <TableRowBody
              v-for="(row, i) in tableData.row"
              :key="'patient-table-row-' + i"
            >
              <TableBody>
                <button
                  @click="handleOnPatientSelect(patients[i].id)"
                  class="px-4 py-1 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-blue-200 disabled:text-blue-600"
                >
                  Pilih
                </button>
              </TableBody>
              <TableBody v-for="(col, j) in row" :key="'patient-table-col-' + j"
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

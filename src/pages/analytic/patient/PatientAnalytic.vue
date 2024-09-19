<script lang="ts" setup>
import { computed, onMounted, Ref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { id as dateLocalId } from "date-fns/locale";
import GrayButton from '../../../components/button/GrayButton.vue';
import ChevLeftIcon from '../../../components/icon/ChevLeftIcon.vue';
import TextSearch from '../../../components/form/TextSearch.vue';
import { useDateFilterStore } from '../../../stores/date_filter.store';
import { DEBOUNCE_TIMEOUT } from '../../../configs/debounce.config';
import { Debouncer } from '../../../utils/debounce';
import { formatLocaleStringDate, formatSQLStringDate, getFilterStartEndISODate, getRelativeTimeStatus, getStartEndOfMonthDate } from '../../../utils/date.util';
import { IPaginationData } from '../../../types/pagination.type';
import { getPatientAnalyticByName, getPatientAnalyticPagination, getPatientAnalyticSummary, IPatientAnalyticResponse, IPatientAnalyticSummary } from '../../../services/patient_analytic.service';
import LoadingSpinner from '../../../components/icon/LoadingSpinner.vue';
import EmptyData from '../../../components/EmptyData.vue';
import ResponsiveTable from '../../../components/tables/ResponsiveTable.vue';
import TableHead from '../../../components/tables/TableHead.vue';
import TableRowBody from '../../../components/tables/TableRowBody.vue';
import TableBody from '../../../components/tables/TableBody.vue';
import Pagination from '../../../components/Pagination.vue';
import SortDialog from '../../../components/dialog/SortDialog.vue';

const debouncer = new Debouncer()
const router = useRouter()
const route = useRoute()
const dateFilterStore = useDateFilterStore();

const patientAnalytics: Ref<IPatientAnalyticResponse[]> = ref([])
const patientAnalyticSummary: Ref<IPatientAnalyticSummary | null> = ref(null)
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const searchQuery = ref("");
const filter = ref({
  date: [],
})
const loadingGetPatientAnalytic = ref(false)
const loadingGetPatientAnalyticSummary = ref(false)

const modalSort = ref(false)
const sortData = ref('')
const sortList = ref([
  { key: 'id|asc', name: 'No RM' },
  { key: 'name|asc', name: 'Nama A-Z' },
  { key: 'name|desc', name: 'Nama Z-A' },
  { key: 'total_treatment|desc', name: 'Perawatan Terbanyak' },
  { key: 'total_treatment|asc', name: 'Perawatan Terkecil' },
  { key: 'last_treatment_date|desc', name: 'Terbaru' },
  { key: 'last_treatment_date|asc', name: 'Terlama' },
])

const tableData = computed(() => {
  if (!patientAnalytics.value.length) return null
  const row = patientAnalytics.value.map((patient) => {
    const lastTreatment = patient.last_treatment_date ? formatLocaleStringDate(patient.last_treatment_date) : 'Belum pernah dirawat'
    const lastTreatmentStatus = patient.last_treatment_date ? getRelativeTimeStatus(new Date(patient.last_treatment_date)) : '-'
    return [patient.no_rm, patient.name, patient.patient_status, patient.total_treatment, lastTreatment, lastTreatmentStatus]
  })
  return {
    header: ['No RM', 'Nama', 'Status Pasien', 'Jumlah Perawatan', 'Terakhir Dirawat', 'Status Terakhir Dirawat'],
    row
  }
})

const resetPaginationData = () => {
  paginationData.value.currentPage = 1;
  paginationData.value.limit = 10;
  paginationData.value.totalItems = 0;
  paginationData.value.totalPage = 1;
};

const getPatientAnalyticData = (page = 1, limit = 10) => {
  loadingGetPatientAnalytic.value = true
  const { startDate, endDate } = getFilterStartEndISODate(
    filter.value.date[0],
    filter.value.date[1]
  );
  getPatientAnalyticPagination({ page, limit }, { startDate, endDate }, sortData.value).then((response) => {
    if (!response) return
    paginationData.value = response.paginationData
    patientAnalytics.value = response.items
  }).finally(() => {
    loadingGetPatientAnalytic.value = false
  })
}

const getPatientAnalyticDataByQuery = () => {
  resetPaginationData()
  if (!searchQuery.value) {
    getPatientAnalyticData();
    return;
  }
  loadingGetPatientAnalytic.value = true;
  const { startDate, endDate } = getFilterStartEndISODate(
    filter.value.date[0],
    filter.value.date[1]
  );
  getPatientAnalyticByName(searchQuery.value, {
    startDate,
    endDate,
  })
    .then((response) => {
      if (!response) return;
      patientAnalytics.value = response;
    })
    .finally(() => {
      loadingGetPatientAnalytic.value = false;
    });
}

const getPatientAnalyticDataSummary = () => {
  loadingGetPatientAnalyticSummary.value = true;
  const { startDate, endDate } = getFilterStartEndISODate(
    filter.value.date[0],
    filter.value.date[1]
  );
  getPatientAnalyticSummary({
    startDate,
    endDate,
  })
    .then((response) => {
      if (!response) return;
      patientAnalyticSummary.value = response;
    })
    .finally(() => {
      loadingGetPatientAnalyticSummary.value = false;
    });
}

const handlePaginationChange = (page: number) => {
  router.replace({ query: { ...route.query, page } });
  getPatientAnalyticData(page);
};

const toPreviousPage = () => {
  router.push({ name: "Home" });
};

const handleDateFilter = () => {
  dateFilterStore.setStoreData({
    start_date: filter.value.date[0],
    end_date: filter.value.date[1],
  });
  getPatientAnalyticDataSummary()
  getPatientAnalyticData()
};

const onSearch = debouncer.debounce(() => {
  getPatientAnalyticDataByQuery();
}, DEBOUNCE_TIMEOUT);

const openModalSort = () => {
  modalSort.value = true
}

const onSort = (value: string) => {
  sortData.value = value
  getPatientAnalyticData()
}

onMounted(() => {
  let page = 1;
  if (route.query.page) {
    page = parseInt(route.query.page as string)
  }

  if (dateFilterStore.start_date && dateFilterStore.end_date) {
    filter.value.date = [
      dateFilterStore.start_date,
      dateFilterStore.end_date
    ] as any
  } else {
    const { startOfMonth, endOfMonth } = getStartEndOfMonthDate()
    filter.value.date = [
      formatSQLStringDate(startOfMonth),
      formatSQLStringDate(endOfMonth)
    ] as any
  }
  getPatientAnalyticDataSummary()
  getPatientAnalyticData(page)
})
</script>

<template>
  <div class="p-8 bg-white rounded-lg">
    <div class="flex flex-col items-start justify-start gap-4 lg:items-center lg:flex-row lg:justify-between">
      <div class="flex gap-3">
        <GrayButton @click="toPreviousPage" class="flex items-center justify-center !px-3">
          <ChevLeftIcon class="w-5 h-5" />
        </GrayButton>
        <h1 class="text-2xl font-medium">Daftar Status Pasien</h1>
      </div>
    </div>
    <div class="mt-5">
      <div class="grid grid-cols-1 gap-2 mb-3 sm:grid-cols-3">
        <VueDatePicker v-model="filter.date" model-type="yyyy-MM-dd" placeholder="Filter tanggal" locale="id"
          format="dd MMMM yyyy" :format-locale="dateLocalId" :enable-time-picker="false" range
          @update:modelValue="handleDateFilter" />
        <button type="button"
          class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          @click="openModalSort">
          Urutkan
        </button>
        <!-- search bar -->
        <TextSearch label="Cari nama" v-model="searchQuery" @update:model-value="onSearch" class="w-full" />
      </div>
    </div>
    <div class="mt-5">
      <div v-if="loadingGetPatientAnalyticSummary" class="flex flex-col items-center justify-center gap-3">
        <LoadingSpinner class="w-8 h-8 text-gray-500 animate-spin"></LoadingSpinner>
        <p class="text-lg text-gray-500">Memuat Data</p>
      </div>
      <div v-else-if="patientAnalyticSummary" class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div class="w-full px-6 py-2 border border-gray-300 rounded-md">
          <p class="text-sm text-gray-600">Total Perawatan</p>
          <p class="text-3xl font-medium">{{ patientAnalyticSummary?.total_treatment }}</p>
        </div>
        <div class="w-full px-6 py-2 border border-gray-300 rounded-md">
          <p class="text-sm text-gray-600">Pasien Baru</p>
          <p class="text-3xl font-medium">{{ patientAnalyticSummary?.new_patient }}</p>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <div v-if="loadingGetPatientAnalytic" class="flex flex-col items-center justify-center gap-3">
        <LoadingSpinner class="w-8 h-8 text-gray-500 animate-spin"></LoadingSpinner>
        <p class="text-lg text-gray-500">Memuat Data</p>
      </div>
      <div v-else-if="patientAnalytics.length">
        <ResponsiveTable v-if="tableData">
          <template v-slot:header>
            <TableHead v-for="(header, i) in tableData.header" :key="'absence-table-header' + i">
              {{ header }}
            </TableHead>
          </template>
          <template v-slot:body>
            <TableRowBody v-for="(row, i) in tableData.row" :key="'absence-table-row-' + i">
              <TableBody v-for="(col, j) in row" :key="'absence-table-col-' + j">{{ col }}
              </TableBody>
            </TableRowBody>
          </template>
        </ResponsiveTable>
        <Pagination :current-page="paginationData.currentPage" :total-pages="paginationData.totalPage"
          :total-items="paginationData.totalItems" :limit="paginationData.limit" @page-change="handlePaginationChange">
        </Pagination>
      </div>
      <EmptyData v-else></EmptyData>
    </div>
  </div>
  <SortDialog v-model="modalSort" :sort-list="sortList" @sort="onSort" />
</template>
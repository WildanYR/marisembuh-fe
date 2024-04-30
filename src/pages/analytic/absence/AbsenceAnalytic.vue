<script setup lang="ts">
import { Ref, computed, onBeforeUnmount, onMounted, ref } from "vue";
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
import {
  IAbsenceAnalyticResponse,
  getAbsenceAnalyticByName,
  getAbsenceAnalyticPagination,
} from "../../../services/absence_analytic.service";
import { id as dateLocalId } from "date-fns/locale";
import { useDateFilterStore } from "../../../stores/date_filter.store";
import {
  formatSQLStringDate,
  getFilterStartEndISODate,
  getStartEndOfMonthDate,
} from "../../../utils/date.util";
import LoadingSpinner from "../../../components/icon/LoadingSpinner.vue";

const debouncer = new Debouncer();
const router = useRouter();
const route = useRoute();
const dateFilterStore = useDateFilterStore();

const absenceAnalytics: Ref<IAbsenceAnalyticResponse[]> = ref([]);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const searchQuery = ref("");
const loadingGetAbsenceAnalytic = ref(false);
const filter = ref({
  date: [],
});

const tableData = computed(() => {
  if (!absenceAnalytics.value.length) return null;
  const row = absenceAnalytics.value.map((absence) => {
    return [absence.name, absence.total, absence.late, absence.absent];
  });
  return {
    header: ["Nama", "Jumlah", "Terlambat", "Tidak berangkat"],
    row,
  };
});

const resetPaginationData = () => {
  paginationData.value.currentPage = 1;
  paginationData.value.limit = 10;
  paginationData.value.totalItems = 0;
  paginationData.value.totalPage = 1;
};

const getAbsenceAnalyticData = (page = 1, limit = 10) => {
  loadingGetAbsenceAnalytic.value = true;
  const { startDate, endDate } = getFilterStartEndISODate(
    filter.value.date[0],
    filter.value.date[1]
  );
  getAbsenceAnalyticPagination(
    { page, limit },
    {
      startDate,
      endDate,
    }
  )
    .then((response) => {
      if (!response) return;
      absenceAnalytics.value = response.items;
      paginationData.value = response.paginationData;
    })
    .finally(() => {
      loadingGetAbsenceAnalytic.value = false;
    });
};

const getAbsenceAnalyticDataByQuery = () => {
  resetPaginationData();
  if (!searchQuery.value) {
    getAbsenceAnalyticData();
    return;
  }
  loadingGetAbsenceAnalytic.value = true;
  const { startDate, endDate } = getFilterStartEndISODate(
    filter.value.date[0],
    filter.value.date[1]
  );
  getAbsenceAnalyticByName(searchQuery.value, {
    startDate,
    endDate,
  })
    .then((response) => {
      if (!response) return;
      absenceAnalytics.value = response;
    })
    .finally(() => {
      loadingGetAbsenceAnalytic.value = false;
    });
};

const handleOnAbsenceAnalyticDetail = (userId: number) => {
  router.push({ name: "AbsenceAnalyticDetail", params: { userId } });
};

const toPreviousPage = () => {
  router.push({ name: "Home" });
};

const onSearch = debouncer.debounce(() => {
  getAbsenceAnalyticDataByQuery();
}, DEBOUNCE_TIMEOUT);

const handleDateFilter = () => {
  dateFilterStore.setStoreData({
    start_date: filter.value.date[0],
    end_date: filter.value.date[1],
  });
  getAbsenceAnalyticData();
};

const handlePaginationChange = (page: number) => {
  router.replace({ query: { ...route.query, page } });
  getAbsenceAnalyticData(page);
};

onMounted(() => {
  let page = 1;
  if (route.query.page) {
    page = parseInt(route.query.page as string);
  }

  if (dateFilterStore.start_date && dateFilterStore.end_date) {
    filter.value.date = [
      dateFilterStore.start_date,
      dateFilterStore.end_date,
    ] as any;
  } else {
    const { startOfMonth, endOfMonth } = getStartEndOfMonthDate();
    filter.value.date = [
      formatSQLStringDate(startOfMonth),
      formatSQLStringDate(endOfMonth),
    ] as any;
  }
  getAbsenceAnalyticData(page);
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
        <h1 class="text-2xl font-medium">Daftar Absen</h1>
      </div>
    </div>
    <div class="mt-5">
      <div class="flex items-center justify-end gap-2 mb-3">
        <VueDatePicker
          v-model="filter.date"
          model-type="yyyy-MM-dd"
          placeholder="Filter tanggal"
          locale="id"
          format="dd MMMM yyyy"
          :format-locale="dateLocalId"
          :enable-time-picker="false"
          range
          @update:modelValue="handleDateFilter"
        />
        <!-- search bar -->
        <TextSearch
          label="Cari nama"
          v-model="searchQuery"
          @update:model-value="onSearch"
          class="w-full lg:w-max"
        />
      </div>
      <div
        v-if="loadingGetAbsenceAnalytic"
        class="flex flex-col items-center justify-center gap-3"
      >
        <LoadingSpinner
          class="w-8 h-8 text-gray-500 animate-spin"
        ></LoadingSpinner>
        <p class="text-lg text-gray-500">Memuat Data</p>
      </div>
      <!-- table -->
      <div v-else-if="absenceAnalytics.length">
        <ResponsiveTable v-if="tableData">
          <template v-slot:header>
            <TableHead
              v-for="(header, i) in tableData.header"
              :key="'absence-table-header' + i"
            >
              {{ header }}
            </TableHead>
            <TableHead>Aksi</TableHead>
          </template>
          <template v-slot:body>
            <TableRowBody
              v-for="(row, i) in tableData.row"
              :key="'absence-table-row-' + i"
            >
              <TableBody v-for="(col, j) in row" :key="'absence-table-col-' + j"
                >{{ col }}
              </TableBody>
              <TableBody class="flex items-center gap-3">
                <button
                  @click="handleOnAbsenceAnalyticDetail(absenceAnalytics[i].id)"
                  class="flex items-center gap-1 px-4 py-1 text-sm text-blue-900 bg-blue-100 rounded-md hover:bg-blue-200 group"
                >
                  Detail
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
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from "vue";
import { IPaginationData } from "../../../types/pagination.type";
import ResponsiveTable from "../../../components/tables/ResponsiveTable.vue";
import TableHead from "../../../components/tables/TableHead.vue";
import TableRowBody from "../../../components/tables/TableRowBody.vue";
import TableBody from "../../../components/tables/TableBody.vue";
import Pagination from "../../../components/Pagination.vue";
import EmptyData from "../../../components/EmptyData.vue";
import { useRouter } from "vue-router";
import GrayButton from "../../../components/button/GrayButton.vue";
import ChevLeftIcon from "../../../components/icon/ChevLeftIcon.vue";
import {
  IAbsenceAnalyticResponse,
  IAbsenceDataResponse,
  getAbsenceAnalyticDetail,
} from "../../../services/absence_analytic.service";
import { id as dateLocalId } from "date-fns/locale";
import {
  formatLocaleStringDate,
  formatSQLStringDate,
  formatTimeStringDate,
  getFilterStartEndISODate,
  getStartEndOfMonthDate,
  isTimeGreaterThan,
} from "../../../utils/date.util";
import { useDateFilterStore } from "../../../stores/date_filter.store";
import { useAuthStore } from "../../../stores/auth.store";

const router = useRouter();
const authStore = useAuthStore();
const dateFilterStore = useDateFilterStore();

const absenceAnalytics: Ref<IAbsenceDataResponse[]> = ref([]);
const absenceSummary: Ref<IAbsenceAnalyticResponse> = ref({
  id: 0,
  name: "",
  absent: 0,
  late: 0,
  total: 0,
});
const absenceLateHour = ref("");
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const loadingAbsenceAnalytic = ref(false);
const filter = ref({
  date: [],
});

const tableData = computed(() => {
  if (!absenceAnalytics.value.length) return null;
  const row = absenceAnalytics.value.map((absence) => {
    const dateString = formatLocaleStringDate(absence.created_at);
    const dateTime = formatTimeStringDate(absence.created_at);
    let afterworkTime = "-";
    if (absence.afterwork_time) {
      afterworkTime = formatTimeStringDate(absence.afterwork_time);
    }
    let inClinicTime = "-";
    if (absence.in_clinic_time) {
      inClinicTime = formatTimeStringDate(absence.in_clinic_time);
    }
    const timeStatus = isTimeGreaterThan(
      absenceLateHour.value,
      absence.created_at
    )
      ? "Terlambat"
      : "Tepat Waktu";
    return [
      dateString,
      dateTime,
      inClinicTime,
      afterworkTime,
      absence.type,
      timeStatus,
    ];
  });
  return {
    header: [
      "Tanggal",
      "Jam Masuk",
      "Jam diklinik",
      "Jam Selesai",
      "Jenis",
      "Status",
    ],
    row,
  };
});

const getAbsenceAnalyticData = (userId: number, page = 1, limit = 10) => {
  loadingAbsenceAnalytic.value = true;
  const { startDate, endDate } = getFilterStartEndISODate(
    filter.value.date[0],
    filter.value.date[1]
  );
  getAbsenceAnalyticDetail(
    userId,
    { page, limit },
    {
      startDate,
      endDate,
    }
  )
    .then((response) => {
      if (!response) return;
      absenceAnalytics.value = response.pagination.items;
      paginationData.value = response.pagination.paginationData;
      absenceSummary.value = response.summary;
      absenceLateHour.value = response.lateHour;
    })
    .finally(() => {
      loadingAbsenceAnalytic.value = false;
    });
};

const toPreviousPage = () => {
  router.push({ name: "Home" });
};

const handleDateFilter = () => {
  getAbsenceAnalyticData(authStore.id);
};

onMounted(() => {
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
  getAbsenceAnalyticData(authStore.id);
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
          <h1 class="text-2xl font-medium">Detail Absen</h1>
          <p class="text-sm text-gray-500">
            {{ absenceSummary.name }}
          </p>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-3 md:grid-cols-2">
      <div class="w-full px-6 py-2 border border-gray-300 rounded-md">
        <p class="text-sm text-gray-600">Jumlah Absen</p>
        <p class="text-3xl font-medium">{{ absenceSummary.total }}</p>
      </div>
      <div class="w-full px-6 py-2 border border-gray-300 rounded-md">
        <p class="text-sm text-gray-600">Jumlah Terlambat</p>
        <p class="text-3xl font-medium">{{ absenceSummary.late }}</p>
      </div>
      <div class="w-full px-6 py-2 border border-gray-300 rounded-md">
        <p class="text-sm text-gray-600">Jumlah Tidak Masuk</p>
        <p class="text-3xl font-medium">{{ absenceSummary.absent }}</p>
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
      </div>
      <!-- table -->
      <div v-if="absenceAnalytics.length">
        <ResponsiveTable v-if="tableData">
          <template v-slot:header>
            <TableHead
              v-for="(header, i) in tableData.header"
              :key="'absence-table-header' + i"
            >
              {{ header }}
            </TableHead>
          </template>
          <template v-slot:body>
            <TableRowBody
              v-for="(row, i) in tableData.row"
              :key="'absence-table-row-' + i"
            >
              <TableBody v-for="(col, j) in row" :key="'absence-table-col-' + j"
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
          @page-change="getAbsenceAnalyticData"
        ></Pagination>
      </div>
      <EmptyData v-else></EmptyData>
    </div>
  </div>
</template>
../../stores/date_filter.store formatSQLStringDate, getStartEndOfMonthDate,
formatSQLStringDate, getStartEndOfMonthDate,

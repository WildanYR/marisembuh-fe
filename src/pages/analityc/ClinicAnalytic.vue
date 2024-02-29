<script setup lang="ts">
import { Ref, computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  getClinicAnalytic,
  getUserAnalytic,
  IClinicAnalytic,
  IUserAnalytic,
} from "../../services/clinic_analytic.service";
import ResponsiveTable from "../../components/tables/ResponsiveTable.vue";
import TableHead from "../../components/tables/TableHead.vue";
import TableRowBody from "../../components/tables/TableRowBody.vue";
import TableBody from "../../components/tables/TableBody.vue";
import EmptyData from "../../components/EmptyData.vue";
import GrayButton from "../../components/button/GrayButton.vue";
import ChevLeftIcon from "../../components/icon/ChevLeftIcon.vue";

const router = useRouter();

const clinicStatistics: Ref<IClinicAnalytic[]> = ref([]);
const therapistStatistics: Ref<IUserAnalytic[]> = ref([]);

const clinicStatisticLoading = ref(false);
const therapistStatisticLoading = ref(false);

const clinicTableData = computed(() => {
  if (!clinicStatistics.value.length) return null;
  const row = clinicStatistics.value.map((clinic) => [
    clinic.name,
    clinic.today_patient,
    clinic.month_patient,
  ]);
  return {
    header: ["Nama", "Pasien Hari ini", "Pasien Bulan ini"],
    row,
  };
});

const therapistTableData = computed(() => {
  if (!therapistStatistics.value.length) return null;
  const row = therapistStatistics.value.map((therapist) => [
    therapist.name,
    therapist.today_patient,
    therapist.month_patient,
  ]);
  return {
    header: ["Nama", "Pasien Hari ini", "Pasien Bulan ini"],
    row,
  };
});

const toPreviousPage = () => {
  router.push({ name: "Home" });
};

const getClinicAnalytics = () => {
  clinicStatisticLoading.value = true;
  getClinicAnalytic()
    .then((response) => {
      if (!response) return;
      clinicStatistics.value = response;
    })
    .finally(() => {
      clinicStatisticLoading.value = false;
    });
};

const getTherapistStatistics = () => {
  therapistStatisticLoading.value = true;
  getUserAnalytic()
    .then((response) => {
      if (!response) return;
      therapistStatistics.value = response;
    })
    .finally(() => {
      therapistStatisticLoading.value = false;
    });
};

onMounted(() => {
  getClinicAnalytics();
  getTherapistStatistics();
});
</script>

<template>
  <div class="space-y-5">
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
          <h1 class="text-2xl font-medium">Analisis Klinik</h1>
        </div>
      </div>
      <div class="mt-5">
        <!-- table -->
        <div v-if="clinicStatistics.length">
          <ResponsiveTable v-if="clinicTableData">
            <template v-slot:header>
              <TableHead
                v-for="(header, i) in clinicTableData.header"
                :key="'Therapy-table-header' + i"
              >
                {{ header }}
              </TableHead>
            </template>
            <template v-slot:body>
              <TableRowBody
                v-for="(row, i) in clinicTableData.row"
                :key="'Therapy-table-row-' + i"
              >
                <TableBody
                  v-for="(col, j) in row"
                  :key="'Therapy-table-col-' + j"
                  >{{ col }}
                </TableBody>
              </TableRowBody>
            </template>
          </ResponsiveTable>
        </div>
        <EmptyData v-else></EmptyData>
      </div>
    </div>
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
          <h1 class="text-2xl font-medium">Analisis Terapis</h1>
        </div>
      </div>
      <div class="mt-5">
        <!-- table -->
        <div v-if="therapistStatistics.length">
          <ResponsiveTable v-if="therapistTableData">
            <template v-slot:header>
              <TableHead
                v-for="(header, i) in therapistTableData.header"
                :key="'Therapy-table-header' + i"
              >
                {{ header }}
              </TableHead>
            </template>
            <template v-slot:body>
              <TableRowBody
                v-for="(row, i) in therapistTableData.row"
                :key="'Therapy-table-row-' + i"
              >
                <TableBody
                  v-for="(col, j) in row"
                  :key="'Therapy-table-col-' + j"
                  >{{ col }}
                </TableBody>
              </TableRowBody>
            </template>
          </ResponsiveTable>
        </div>
        <EmptyData v-else></EmptyData>
      </div>
    </div>
  </div>
</template>
../../services/clinic_analityc.service

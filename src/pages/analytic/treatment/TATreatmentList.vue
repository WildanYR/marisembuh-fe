<script setup lang="ts">
import { Ref, computed, onMounted, reactive, ref } from "vue";
import {
  IGetTreatmentQuery,
  ITreatmentResponse,
  getAllTreatmentWithPagination,
} from "../../../services/treatment.service";
import { IPaginationData } from "../../../types/pagination.type";
import ResponsiveTable from "../../../components/tables/ResponsiveTable.vue";
import TableHead from "../../../components/tables/TableHead.vue";
import TableRowBody from "../../../components/tables/TableRowBody.vue";
import TableBody from "../../../components/tables/TableBody.vue";
import Pagination from "../../../components/Pagination.vue";
import EmptyData from "../../../components/EmptyData.vue";
import { useRoute, useRouter } from "vue-router";
import { getPatientById } from "../../../services/patient.service";
import GrayButton from "../../../components/button/GrayButton.vue";
import ChevLeftIcon from "../../../components/icon/ChevLeftIcon.vue";
import { formatLocaleStringDate } from "../../../utils/date.util";
import { getUserById } from "../../../services/user.service";
import { getClinicById } from "../../../services/clinic.service";
import { useAuthStore } from "../../../stores/auth.store";
import { Roles } from "../../../types/role.enum";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const treatments: Ref<ITreatmentResponse[]> = ref([]);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const detailData = reactive({
  id: 0,
  name: "",
});
const loadingGetTreatment = ref(false);
const loadingGetDetail = ref(false);

const tableData = computed(() => {
  if (!treatments.value.length) return null;
  const row = treatments.value.map((treatment) => {
    const dateString = formatLocaleStringDate(treatment.created_at);
    const therapist = treatment.user ? treatment.user.name : "";
    const clinic = treatment.clinic ? treatment.clinic.name : "Homecare";
    const patientName = treatment.patient?.name || "";
    return [dateString, treatment.objective, patientName, therapist, clinic];
  });
  return {
    header: ["Tanggal", "Tujuan", "Pasien", "Terapis", "Klinik"],
    row,
  };
});

const getDetailData = () => {
  loadingGetDetail.value = true;
  if (route.name === "TAPatientTreatmentList") {
    getPatientById(route.params.patientId as any)
      .then((response) => {
        if (!response) return;
        detailData.id = response.id;
        detailData.name = response.name;
      })
      .finally(() => {
        loadingGetDetail.value = false;
      });
  } else if (route.name === "TAClinicTreatmentList") {
    getClinicById(route.params.clinicId as any)
      .then((response) => {
        if (!response) return;
        detailData.id = response.id;
        detailData.name = response.name;
      })
      .finally(() => {
        loadingGetDetail.value = false;
      });
  } else {
    getUserById(route.params.userId as any)
      .then((response) => {
        if (!response) return;
        detailData.id = response.id;
        detailData.name = response.name;
      })
      .finally(() => {
        loadingGetDetail.value = false;
      });
  }
};

const getTreatmentData = (page = 1, limit = 10) => {
  loadingGetTreatment.value = true;
  let condition: IGetTreatmentQuery = {};
  if (authStore.role === Roles.ADMIN) {
    if (route.params.patientId) {
      condition.patient_id = route.params.patientId as string;
    }
    if (route.params.userId) {
      condition.user_id = route.params.userId as string;
    }
    if (route.params.clinicId) {
      condition.clinic_id = route.params.clinicId as string;
    }
  } else {
    condition.user_id = authStore.id;
  }

  getAllTreatmentWithPagination(condition, { page, limit })
    .then((response) => {
      if (!response) return;
      treatments.value = response.items;
      paginationData.value = response.paginationData;
    })
    .finally(() => {
      loadingGetTreatment.value = false;
    });
};

const handleOnTreatmentDetail = (treatmentId: number) => {
  const ref = { name: route.name, params: route.params, query: route.query };
  const refStr = encodeURIComponent(JSON.stringify(ref));
  router.push({
    name: "TATreatmentDetail",
    params: { id: treatmentId },
    query: { ref: refStr },
  });
};

const toPreviousPage = () => {
  if (route.name === "TAPatientTreatmentList") {
    router.push({ name: "TAPatientList" });
  } else if (route.name === "TAUserTreatmentList") {
    router.push({ name: "TAUserList" });
  } else if (route.name === "TAClinicTreatmentList") {
    router.push({ name: "TAClinicList" });
  } else {
    router.push({ name: "Home" });
  }
};

const handlePaginationChange = (page: number) => {
  router.replace({ query: { ...route.query, page } });
  getTreatmentData(page);
};

onMounted(() => {
  let page = 1;
  if (route.query.page) {
    page = parseInt(route.query.page as string);
  }

  if (authStore.role === Roles.ADMIN) {
    getDetailData();
  }
  getTreatmentData(page);
});
</script>

<template>
  <div class="p-8 bg-white rounded-lg">
    <div
      class="flex flex-col items-start justify-start gap-4 lg:items-center lg:flex-row lg:justify-between"
    >
      <div class="flex gap-4">
        <GrayButton
          @click="toPreviousPage"
          class="flex items-center justify-center"
        >
          <ChevLeftIcon class="w-5 h-5" />
        </GrayButton>
        <div>
          <h1 class="text-2xl font-medium">Daftar Perawatan (Analisis)</h1>
          <p v-if="detailData.id" class="text-sm text-gray-500">
            {{ detailData.id }} | {{ detailData.name }}
          </p>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <!-- table -->
      <div v-if="treatments.length">
        <ResponsiveTable v-if="tableData">
          <template v-slot:header>
            <TableHead
              v-for="(header, i) in tableData.header"
              :key="'treatment-table-header' + i"
            >
              {{ header }}
            </TableHead>
            <TableHead>Aksi</TableHead>
          </template>
          <template v-slot:body>
            <TableRowBody
              v-for="(row, i) in tableData.row"
              :key="'treatment-table-row-' + i"
            >
              <TableBody
                v-for="(col, j) in row"
                :key="'treatment-table-col-' + j"
                >{{ col }}
              </TableBody>
              <TableBody class="flex items-center gap-3">
                <button
                  @click="handleOnTreatmentDetail(treatments[i].id)"
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

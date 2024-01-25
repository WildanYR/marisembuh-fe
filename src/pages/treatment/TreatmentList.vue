<script setup lang="ts">
import { Ref, computed, onMounted, reactive, ref } from "vue";
import PlusIcon from "../../components/icon/PlusIcon.vue";
import {
  ITreatmentResponse,
  deleteTreatment,
  getAllTreatmentWithPagination,
} from "../../services/treatment.service";
import { IPaginationData } from "../../types/pagination.type";
import ResponsiveTable from "../../components/tables/ResponsiveTable.vue";
import TableHead from "../../components/tables/TableHead.vue";
import TableRowBody from "../../components/tables/TableRowBody.vue";
import TableBody from "../../components/tables/TableBody.vue";
import Pagination from "../../components/Pagination.vue";
import EmptyData from "../../components/EmptyData.vue";
import { useRoute, useRouter } from "vue-router";
import ConfirmDialog from "../../components/dialog/ConfirmDialog.vue";
import { getPatientById } from "../../services/patient.service";
import GrayButton from "../../components/button/GrayButton.vue";
import ChevLeftIcon from "../../components/icon/ChevLeftIcon.vue";

const router = useRouter();
const route = useRoute();

const treatments: Ref<ITreatmentResponse[]> = ref([]);
const selectedTreatment: Ref<ITreatmentResponse | null> = ref(null);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const patientData = reactive({
  id: 0,
  no_rm: "",
  name: "",
});
const loadingGetTreatment = ref(false);
const loadingGetPatient = ref(false);
const loadingDeleteTreatment = ref(false);
const modalDeleteOpen = ref(false);

const tableData = computed(() => {
  if (!treatments.value.length) return null;
  const row = treatments.value.map((treatment) => {
    const dateString = new Date(treatment.created_at).toLocaleDateString(
      "id-ID",
      {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }
    );
    return [dateString, treatment.objective];
  });
  return {
    header: ["Tanggal", "Tujuan"],
    row,
  };
});

// const resetPaginationData = () => {
//   paginationData.value.currentPage = 1;
//   paginationData.value.limit = 10;
//   paginationData.value.totalItems = 0;
//   paginationData.value.totalPage = 1;
// };

const getPatientData = () => {
  loadingGetPatient.value = true;
  getPatientById(route.params.patientId as any)
    .then((response) => {
      if (!response) return;
      patientData.id = response.id;
      patientData.no_rm = response.no_rm;
      patientData.name = response.name;
    })
    .finally(() => {
      loadingGetPatient.value = false;
    });
};

const getTreatmentData = (page = 1, limit = 10) => {
  loadingGetTreatment.value = true;
  getAllTreatmentWithPagination(route.params.patientId as any, { page, limit })
    .then((response) => {
      if (!response) return;
      treatments.value = response.items;
      paginationData.value = response.paginationData;
    })
    .finally(() => {
      loadingGetTreatment.value = false;
    });
};

const handleOnTreatmentAdd = () => {
  router.push({
    name: "TreatmentAdd",
    params: { patientId: route.params.patientId },
  });
};

const handleOnTreatmentDetail = (treatmentId: number) => {
  router.push({ name: "TreatmentDetail", params: { id: treatmentId } });
};

const handleOnTreatmentEdit = (treatmentId: number) => {
  router.push({ name: "TreatmentEdit", params: { id: treatmentId } });
};

const handleOnTreatmentDelete = () => {
  loadingDeleteTreatment.value = true;
  deleteTreatment(selectedTreatment.value!.id)
    .then(() => {
      getTreatmentData(
        paginationData.value.currentPage,
        paginationData.value.limit
      );
    })
    .finally(() => {
      loadingDeleteTreatment.value = false;
      modalDeleteOpen.value = false;
    });
};

const openDeleteModal = (treatmentId: number) => {
  selectedTreatment.value = treatments.value.find(
    (treatment) => treatment.id === treatmentId
  )!;
  modalDeleteOpen.value = true;
};

const toPreviousPage = () => {
  router.push({ name: "TreatmentPatientList" });
};

onMounted(() => {
  getPatientData();
  getTreatmentData();
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
          <h1 class="text-2xl font-medium">Daftar Perawatan</h1>
          <p class="text-sm text-gray-500">
            {{ patientData.no_rm }} | {{ patientData.name }}
          </p>
        </div>
      </div>
      <button
        type="button"
        @click="handleOnTreatmentAdd"
        class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg lg:w-max hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        <PlusIcon class="w-4 h-4"></PlusIcon>
        <span>Tambah Perawatan</span>
      </button>
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
                <button
                  @click="handleOnTreatmentEdit(treatments[i].id)"
                  class="flex items-center gap-1 px-4 py-1 text-sm rounded-md text-amber-900 bg-amber-100 hover:bg-amber-200 group"
                >
                  Edit
                </button>
                <button
                  @click="openDeleteModal(treatments[i].id)"
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
          @page-change="getTreatmentData"
        ></Pagination>
      </div>
      <EmptyData v-else></EmptyData>
    </div>
  </div>
  <ConfirmDialog
    v-model="modalDeleteOpen"
    title="Hapus Perawatan"
    button-text="Hapus"
    :loading-confirm="loadingDeleteTreatment"
    @confirm="handleOnTreatmentDelete"
  >
    konfirmasi untuk menghapus data?
  </ConfirmDialog>
</template>

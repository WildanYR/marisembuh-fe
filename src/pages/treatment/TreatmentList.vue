<script setup lang="ts">
import { Ref, computed, onMounted, ref } from "vue";
import PlusIcon from "../../components/icon/PlusIcon.vue";
import {
  IGetTreatmentQuery,
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
import { useRouter } from "vue-router";
import ConfirmDialog from "../../components/dialog/ConfirmDialog.vue";
import GrayButton from "../../components/button/GrayButton.vue";
import ChevLeftIcon from "../../components/icon/ChevLeftIcon.vue";
import { formatLocaleStringDate } from "../../utils/date.util";
import { useAuthStore } from "../../stores/auth.store";
import { Roles } from "../../types/role.enum";
import {
  getAllPatientArrivalWithPagination,
  IPatientArrivalResponse,
  IQueryFilterPatientArrival,
} from "../../services/patient_arrival.service";

const router = useRouter();
const authStore = useAuthStore();

const treatments: Ref<ITreatmentResponse[]> = ref([]);
const patientArrivals: Ref<IPatientArrivalResponse[]> = ref([]);
const selectedTreatment: Ref<ITreatmentResponse | null> = ref(null);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const patientArrivalPaginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const loadingGetTreatment = ref(false);
const loadingGetPatientArrival = ref(false);
const loadingDeleteTreatment = ref(false);
const modalDeleteOpen = ref(false);

const tableData = computed(() => {
  if (!treatments.value.length) return null;
  const row = treatments.value.map((treatment) => {
    const dateString = formatLocaleStringDate(treatment.created_at);
    const therapist = treatment.user ? treatment.user.name : "";
    const clinic = treatment.clinic ? treatment.clinic.name : "Homecare";

    const data = [dateString, treatment.patient.name, clinic];
    if (authStore.role === Roles.ADMIN) {
      data.push(therapist);
    }
    return data;
  });

  const header = ["Tanggal", "Pasien", "Klinik"];
  if (authStore.role === Roles.ADMIN) {
    header.push("Terapis");
  }

  return {
    header,
    row,
  };
});

const patientArrivalTableData = computed(() => {
  if (!patientArrivals.value.length) return null;
  const row = patientArrivals.value.map((item) => {
    const dateString = formatLocaleStringDate(item.created_at);
    return [dateString, item.patient.name, item.user.name];
  });

  return {
    header: ["Tanggal", "Pasien", "Terapis"],
    row,
  };
});

const getTreatmentData = (page = 1, limit = 10) => {
  loadingGetTreatment.value = true;
  const condition: IGetTreatmentQuery = {};
  if (authStore.role !== Roles.ADMIN) {
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

const getPatientArrivalData = (
  page = 1,
  limit = 10,
  queryFilter?: IQueryFilterPatientArrival
) => {
  loadingGetPatientArrival.value = true;
  getAllPatientArrivalWithPagination({ page, limit }, queryFilter)
    .then((response) => {
      patientArrivals.value = response.items;
      patientArrivalPaginationData.value = response.paginationData;
    })
    .finally(() => {
      loadingGetPatientArrival.value = false;
    });
};

const handleOnTreatmentAdd = () => {
  router.push({ name: "TreatmentAdd" });
};

const handleOnTreatmentFill = (patientId: number) => {
  router.push({ name: "TreatmentFill", params: { patientId } });
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
  router.push({ name: "Home" });
};

onMounted(() => {
  getPatientArrivalData(
    patientArrivalPaginationData.value.currentPage,
    patientArrivalPaginationData.value.limit,
    { done: false, user_id: authStore.id }
  );
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
        <h1 class="text-2xl font-medium">Daftar Perawatan</h1>
      </div>
      <button
        type="button"
        @click="handleOnTreatmentAdd"
        class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg lg:w-max hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
      >
        <PlusIcon class="w-4 h-4"></PlusIcon>
        <span>Tambah Perawatan</span>
      </button>
    </div>
    <div class="mt-5">
      <!-- TAMBAHKAN TABEL LIST DARI DATA PERAWATAN YANG PERLU DIISI (YANG SUDAH DITAMBAHKAN DI KEDATANGAN PASIEN) -->
      <div v-if="patientArrivals.length">
        <p class="mb-3 text-xl font-medium text-gray-700">
          Data perawatan perlu dilengkapi
        </p>
        <ResponsiveTable v-if="patientArrivalTableData">
          <template v-slot:header>
            <TableHead
              v-for="(header, i) in patientArrivalTableData.header"
              :key="'treatment-table-header' + i"
            >
              {{ header }}
            </TableHead>
            <TableHead>Aksi</TableHead>
          </template>
          <template v-slot:body>
            <TableRowBody
              v-for="(row, i) in patientArrivalTableData.row"
              :key="'treatment-table-row-' + i"
            >
              <TableBody
                v-for="(col, j) in row"
                :key="'treatment-table-col-' + j"
                >{{ col }}
              </TableBody>
              <TableBody class="flex items-center gap-3">
                <button
                  @click="handleOnTreatmentFill(patientArrivals[i].patient.id)"
                  class="flex items-center gap-1 px-4 py-1 text-sm text-blue-900 bg-blue-100 rounded-md hover:bg-blue-200 group"
                >
                  Isi data
                </button>
              </TableBody>
            </TableRowBody>
          </template>
        </ResponsiveTable>
        <Pagination
          :current-page="patientArrivalPaginationData.currentPage"
          :total-pages="patientArrivalPaginationData.totalPage"
          :total-items="patientArrivalPaginationData.totalItems"
          :limit="patientArrivalPaginationData.limit"
          @page-change="getPatientArrivalData"
        ></Pagination>
      </div>
      <!-- table -->
      <div v-if="treatments.length">
        <p class="mb-3 text-xl font-medium text-gray-700">
          Daftar Pasien yang pernah dirawat
        </p>
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

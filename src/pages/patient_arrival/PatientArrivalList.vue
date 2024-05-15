<script setup lang="ts">
import { Ref, computed, onMounted, ref } from "vue";
import PlusIcon from "../../components/icon/PlusIcon.vue";
import { IPaginationData } from "../../types/pagination.type";
import ResponsiveTable from "../../components/tables/ResponsiveTable.vue";
import TableHead from "../../components/tables/TableHead.vue";
import TableRowBody from "../../components/tables/TableRowBody.vue";
import TableBody from "../../components/tables/TableBody.vue";
import Pagination from "../../components/Pagination.vue";
import EmptyData from "../../components/EmptyData.vue";
import { useRoute, useRouter } from "vue-router";
import GrayButton from "../../components/button/GrayButton.vue";
import ChevLeftIcon from "../../components/icon/ChevLeftIcon.vue";
import {
  IPatientArrivalResponse,
  deletePatientArrival,
} from "../../services/patient_arrival.service";
import { getAllPatientArrivalWithPagination } from "../../services/patient_arrival.service";
import { formatLocaleStringDate } from "../../utils/date.util";
import LoadingSpinner from "../../components/icon/LoadingSpinner.vue";
import ConfirmDialog from "../../components/dialog/ConfirmDialog.vue";
import { notify } from "@kyvg/vue3-notification";

const router = useRouter();
const route = useRoute();

const patientArrival: Ref<IPatientArrivalResponse[]> = ref([]);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});

const selectedPatientArrival = ref({
  id: 0,
  name: "",
});

const loadingGetPatientArrival = ref(false);
const loadingDeletePatientArrival = ref(false);

const showModalDeletePatientArrival = ref(false);

const tableData = computed(() => {
  if (!patientArrival.value.length) return null;
  const row = patientArrival.value.map((patientArrival) => {
    const dateString = formatLocaleStringDate(patientArrival.created_at);
    let clinic = "";

    if (patientArrival.type === "HOMECARE") {
      clinic = "Homecare";
    } else if (patientArrival.patient.register_clinic) {
      clinic = patientArrival.patient.register_clinic.name;
    }

    return [
      dateString,
      patientArrival.patient.no_rm,
      patientArrival.patient.name,
      patientArrival.patient.address,
      clinic,
      patientArrival.user.name,
      patientArrival.done ? "Sudah dirawat" : "Belum dirawat",
    ];
  });
  return {
    header: [
      "Tanggal",
      "No RM",
      "Nama",
      "Alamat",
      "Klinik",
      "Terapis",
      "Selesai",
    ],
    row,
  };
});

const getPatientArrivalData = (page = 1, limit = 10) => {
  loadingGetPatientArrival.value = true;
  getAllPatientArrivalWithPagination({ page, limit })
    .then((response) => {
      if (!response) return;
      patientArrival.value = response.items;
      paginationData.value = response.paginationData;
    })
    .finally(() => {
      loadingGetPatientArrival.value = false;
    });
};

const handleOnPatientArrivalAdd = () => {
  router.push({ name: "PatientArrivalAdd" });
};

const toPreviousPage = () => {
  router.push({ name: "Home" });
};

const handlePaginationChange = (page: number) => {
  router.replace({ query: { ...route.query, page } });
  getPatientArrivalData(page);
};

const openDeletePatientArrivalModal = (
  patientArrivalId: number,
  patientArrivalName: string
) => {
  selectedPatientArrival.value.id = patientArrivalId;
  selectedPatientArrival.value.name = patientArrivalName;
  showModalDeletePatientArrival.value = true;
};

const handleEditPatientArrival = (patientArrivalId: number) => {
  router.push({ name: "PatientArrivalEdit", params: { id: patientArrivalId } });
};

const handleDeletePatientArrival = () => {
  loadingDeletePatientArrival.value = true;
  deletePatientArrival(selectedPatientArrival.value.id).finally(() => {
    showModalDeletePatientArrival.value = false;
    loadingDeletePatientArrival.value = false;
    notify({ type: "info", title: "Berhasil", text: "Data berhasil dihapus" });
    getPatientArrivalData();
  });
};

onMounted(() => {
  let page = 1;
  if (route.query.page) {
    page = parseInt(route.query.page as string);
  }
  getPatientArrivalData(page);
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
        <h1 class="text-2xl font-medium">Daftar Pasien Datang</h1>
      </div>
      <button
        type="button"
        @click="handleOnPatientArrivalAdd"
        class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg lg:w-max hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
      >
        <PlusIcon class="w-4 h-4"></PlusIcon>
        <span>Tambah Pasien Datang</span>
      </button>
    </div>
    <div class="mt-5">
      <div
        v-if="loadingGetPatientArrival"
        class="flex flex-col items-center justify-center gap-3"
      >
        <LoadingSpinner
          class="w-8 h-8 text-gray-500 animate-spin"
        ></LoadingSpinner>
        <p class="text-lg text-gray-500">Memuat Data</p>
      </div>
      <!-- table -->
      <div v-else-if="patientArrival.length">
        <ResponsiveTable v-if="tableData">
          <template v-slot:header>
            <TableHead
              v-for="(header, i) in tableData.header"
              :key="'patient-table-header' + i"
            >
              {{ header }}
            </TableHead>
            <TableHead>Aksi</TableHead>
          </template>
          <template v-slot:body>
            <TableRowBody
              v-for="(row, i) in tableData.row"
              :key="'patient-table-row-' + i"
            >
              <TableBody v-for="(col, j) in row" :key="'patient-table-col-' + j"
                >{{ col }}
              </TableBody>
              <TableBody class="flex items-center gap-3">
                <button
                  @click="handleEditPatientArrival(patientArrival[i].id)"
                  class="flex items-center gap-1 px-4 py-1 text-sm rounded-md text-amber-900 bg-amber-100 hover:bg-amber-200 group"
                >
                  Edit
                </button>
                <button
                  @click="
                    openDeletePatientArrivalModal(
                      patientArrival[i].id,
                      patientArrival[i].patient.name
                    )
                  "
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
    v-model="showModalDeletePatientArrival"
    title="Hapus Kedatangan Pasien"
    button-text="Hapus"
    :loading-confirm="loadingDeletePatientArrival"
    @confirm="handleDeletePatientArrival"
  >
    konfirmasi untuk menghapus,
    <span class="font-medium">{{ selectedPatientArrival.name }}</span>
  </ConfirmDialog>
</template>

<script setup lang="ts">
import { Ref, computed, onBeforeUnmount, onMounted, ref } from "vue";
import PlusIcon from "../../components/icon/PlusIcon.vue";
import {
  IPatientResponse,
  deletePatient,
  getAllPatientWithPagination,
  getPatientByName,
} from "../../services/patient.service";
import { IPaginationData } from "../../types/pagination.type";
import ResponsiveTable from "../../components/tables/ResponsiveTable.vue";
import TableHead from "../../components/tables/TableHead.vue";
import TableRowBody from "../../components/tables/TableRowBody.vue";
import TableBody from "../../components/tables/TableBody.vue";
import Pagination from "../../components/Pagination.vue";
import EmptyData from "../../components/EmptyData.vue";
import { useRouter } from "vue-router";
import TextSearch from "../../components/form/TextSearch.vue";
import ConfirmDialog from "../../components/dialog/ConfirmDialog.vue";
import GrayButton from "../../components/button/GrayButton.vue";
import ChevLeftIcon from "../../components/icon/ChevLeftIcon.vue";
import { Debouncer } from "../../utils/debounce";

const debouncer = new Debouncer();
const router = useRouter();

const patients: Ref<IPatientResponse[]> = ref([]);
const selectedPatient: Ref<IPatientResponse | null> = ref(null);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const searchQuery = ref("");
const loadingPatient = ref(false);
const loadingDeletePatient = ref(false);
const modalDeleteOpen = ref(false);

const tableData = computed(() => {
  if (!patients.value.length) return null;
  const row = patients.value.map((patient) => {
    const today = new Date();
    const birthDate = new Date(patient.birthdate);
    const m = today.getMonth() - birthDate.getMonth();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return [
      patient.no_rm,
      patient.name,
      patient.gender === "L" ? "Laki-laki" : "Perempuan",
      age,
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

const handleOnPatientAdd = () => {
  router.push({ name: "PatientAdd" });
};

const handleOnPatientDetail = (patientId: number) => {
  router.push({ name: "PatientDetail", params: { id: patientId } });
};

const handleOnPatientEdit = (patientId: number) => {
  router.push({ name: "PatientEdit", params: { id: patientId } });
};

const handleOnPatientDelete = () => {
  loadingDeletePatient.value = true;
  deletePatient(selectedPatient.value!.id)
    .then(() => {
      getPatientData(
        paginationData.value.currentPage,
        paginationData.value.limit
      );
    })
    .finally(() => {
      loadingDeletePatient.value = false;
      modalDeleteOpen.value = false;
    });
};

const openDeleteModal = (patientId: number) => {
  selectedPatient.value = patients.value.find(
    (patient) => patient.id === patientId
  )!;
  modalDeleteOpen.value = true;
};

const toPreviousPage = () => {
  router.push({ name: "Home" });
};

const onSearch = debouncer.debounce(() => {
  getPatientDataByQuery();
}, 1000);

onMounted(() => {
  getPatientData();
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
        <h1 class="text-2xl font-medium">Daftar Pasien</h1>
      </div>
      <button
        type="button"
        @click="handleOnPatientAdd"
        class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg lg:w-max hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        <PlusIcon class="w-4 h-4"></PlusIcon>
        <span>Tambah Pasien</span>
      </button>
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
                  @click="handleOnPatientDetail(patients[i].id)"
                  class="flex items-center gap-1 px-4 py-1 text-sm text-blue-900 bg-blue-100 rounded-md hover:bg-blue-200 group"
                >
                  Detail
                </button>
                <button
                  @click="handleOnPatientEdit(patients[i].id)"
                  class="flex items-center gap-1 px-4 py-1 text-sm rounded-md text-amber-900 bg-amber-100 hover:bg-amber-200 group"
                >
                  Edit
                </button>
                <button
                  @click="openDeleteModal(patients[i].id)"
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
          @page-change="getPatientData"
        ></Pagination>
      </div>
      <EmptyData v-else></EmptyData>
    </div>
  </div>
  <ConfirmDialog
    v-model="modalDeleteOpen"
    title="Hapus Pasien"
    button-text="Hapus"
    :loading-confirm="loadingDeletePatient"
    @confirm="handleOnPatientDelete"
  >
    konfirmasi untuk menghapus,
    <span class="font-medium">{{ selectedPatient?.name }}</span
    >?
  </ConfirmDialog>
</template>

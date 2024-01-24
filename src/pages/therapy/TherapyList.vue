<script setup lang="ts">
import { Ref, computed, onMounted, ref } from "vue";
import PlusIcon from "../../components/icon/PlusIcon.vue";
import {
  ITherapyResponse,
  deleteTherapy,
  getAllTherapyWithPagination,
  getTherapyByName,
} from "../../services/therapy.service";
import { IPaginationData } from "../../types/pagination.type";
import ResponsiveTable from "../../components/tables/ResponsiveTable.vue";
import TableHead from "../../components/tables/TableHead.vue";
import TableRowBody from "../../components/tables/TableRowBody.vue";
import TableBody from "../../components/tables/TableBody.vue";
import Pagination from "../../components/Pagination.vue";
import EmptyData from "../../components/EmptyData.vue";
import { useRouter } from "vue-router";
import LoadingButton from "../../components/LoadingButton.vue";
import TextSearch from "../../components/form/TextSearch.vue";
import ConfirmDialog from "../../components/dialog/ConfirmDialog.vue";
import GrayButton from "../../components/button/GrayButton.vue";
import ChevLeftIcon from "../../components/icon/ChevLeftIcon.vue";

const router = useRouter();

const Therapys: Ref<ITherapyResponse[]> = ref([]);
const selectedTherapy: Ref<ITherapyResponse | null> = ref(null);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const searchQuery = ref("");
const loadingTherapy = ref(false);
const loadingDeleteTherapy = ref(false);
const modalDeleteOpen = ref(false);

const tableData = computed(() => {
  if (!Therapys.value.length) return null;
  const row = Therapys.value.map((Therapy) => {
    return [Therapy.name];
  });
  return {
    header: ["Nama"],
    row,
  };
});

const resetPaginationData = () => {
  paginationData.value.currentPage = 1;
  paginationData.value.limit = 10;
  paginationData.value.totalItems = 0;
  paginationData.value.totalPage = 1;
};

const getTherapyData = (page = 1, limit = 10) => {
  loadingTherapy.value = true;
  getAllTherapyWithPagination({ page, limit })
    .then((response) => {
      if (!response) return;
      Therapys.value = response.items;
      paginationData.value = response.paginationData;
    })
    .finally(() => {
      loadingTherapy.value = false;
    });
};

const getTherapyDataByQuery = () => {
  resetPaginationData();
  if (!searchQuery.value) {
    getTherapyData();
    return;
  }
  loadingTherapy.value = true;
  getTherapyByName(searchQuery.value)
    .then((response) => {
      if (!response) return;
      Therapys.value = response;
    })
    .finally(() => {
      loadingTherapy.value = false;
    });
};

const handleOnTherapyAdd = () => {
  router.push({ name: "TherapyAdd" });
};

const handleOnTherapyEdit = (TherapyId: number) => {
  router.push({ name: "TherapyEdit", params: { id: TherapyId } });
};

const handleOnTherapyDelete = () => {
  loadingDeleteTherapy.value = true;
  deleteTherapy(selectedTherapy.value!.id)
    .then(() => {
      getTherapyData(
        paginationData.value.currentPage,
        paginationData.value.limit
      );
    })
    .finally(() => {
      loadingDeleteTherapy.value = false;
      modalDeleteOpen.value = false;
    });
};

const openDeleteModal = (TherapyId: number) => {
  selectedTherapy.value = Therapys.value.find(
    (Therapy) => Therapy.id === TherapyId
  )!;
  modalDeleteOpen.value = true;
};

const toPreviousPage = () => {
  router.push({ name: "Home" });
};

onMounted(() => {
  getTherapyData();
});
</script>

<template>
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
      <h1 class="text-2xl font-medium">Daftar Terapi (tindakan)</h1>
    </div>
    <button
      type="button"
      @click="handleOnTherapyAdd"
      class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg lg:w-max hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      <PlusIcon class="w-4 h-4"></PlusIcon>
      <span>Tambah Terapi</span>
    </button>
  </div>
  <div class="mt-5">
    <div class="flex justify-end gap-2 mb-3">
      <!-- search bar -->
      <TextSearch
        label="Cari nama"
        v-model="searchQuery"
        class="w-full lg:w-max"
      />
      <LoadingButton
        :loading="loadingTherapy"
        @click="getTherapyDataByQuery"
        class="px-4 py-1 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-blue-200 disabled:text-blue-600"
      >
        Cari
      </LoadingButton>
    </div>
    <!-- table -->
    <div v-if="Therapys.length">
      <ResponsiveTable v-if="tableData">
        <template v-slot:header>
          <TableHead
            v-for="(header, i) in tableData.header"
            :key="'Therapy-table-header' + i"
          >
            {{ header }}
          </TableHead>
          <TableHead>Aksi</TableHead>
        </template>
        <template v-slot:body>
          <TableRowBody
            v-for="(row, i) in tableData.row"
            :key="'Therapy-table-row-' + i"
          >
            <TableBody v-for="(col, j) in row" :key="'Therapy-table-col-' + j"
              >{{ col }}
            </TableBody>
            <TableBody class="flex items-center gap-3">
              <button
                @click="handleOnTherapyEdit(Therapys[i].id)"
                class="flex items-center gap-1 px-4 py-1 text-sm rounded-md text-amber-900 bg-amber-100 hover:bg-amber-200 group"
              >
                Edit
              </button>
              <button
                @click="openDeleteModal(Therapys[i].id)"
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
        @page-change="getTherapyData"
      ></Pagination>
    </div>
    <EmptyData v-else></EmptyData>
  </div>
  <ConfirmDialog
    v-model="modalDeleteOpen"
    title="Hapus Terapi (tindakan)"
    button-text="Hapus"
    :loading-confirm="loadingDeleteTherapy"
    @confirm="handleOnTherapyDelete"
  >
    konfirmasi untuk menghapus,
    <span class="font-medium">{{ selectedTherapy?.name }}</span>
  </ConfirmDialog>
</template>

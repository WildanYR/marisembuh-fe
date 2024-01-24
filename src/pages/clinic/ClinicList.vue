<script setup lang="ts">
import { Ref, computed, onMounted, ref } from "vue";
import PlusIcon from "../../components/icon/PlusIcon.vue";
import {
  IClinicResponse,
  deleteClinic,
  getAllClinicWithPagination,
  getClinicByName,
} from "../../services/clinic.service";
import { IPaginationData } from "../../types/pagination.type";
import ResponsiveTable from "../../components/tables/ResponsiveTable.vue";
import TableHead from "../../components/tables/TableHead.vue";
import TableRowBody from "../../components/tables/TableRowBody.vue";
import TableBody from "../../components/tables/TableBody.vue";
import Pagination from "../../components/Pagination.vue";
import EmptyData from "../../components/EmptyData.vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import ThreeDotIcon from "../../components/icon/ThreeDotIcon.vue";
import { useRouter } from "vue-router";
import LoadingButton from "../../components/LoadingButton.vue";
import EditIcon from "../../components/icon/EditIcon.vue";
import TrashIcon from "../../components/icon/TrashIcon.vue";
import TextSearch from "../../components/form/TextSearch.vue";
import ConfirmDialog from "../../components/dialog/ConfirmDialog.vue";
import GrayButton from "../../components/button/GrayButton.vue";
import ChevLeftIcon from "../../components/icon/ChevLeftIcon.vue";

const router = useRouter();

const Clinics: Ref<IClinicResponse[]> = ref([]);
const selectedClinic: Ref<IClinicResponse | null> = ref(null);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const searchQuery = ref("");
const loadingClinic = ref(false);
const loadingDeleteClinic = ref(false);
const modalDeleteOpen = ref(false);

const tableData = computed(() => {
  if (!Clinics.value.length) return null;
  const row = Clinics.value.map((Clinic) => {
    return [Clinic.name];
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

const getClinicData = (page = 1, limit = 10) => {
  loadingClinic.value = true;
  getAllClinicWithPagination({ page, limit })
    .then((response) => {
      if (!response) return;
      Clinics.value = response.items;
      paginationData.value = response.paginationData;
    })
    .finally(() => {
      loadingClinic.value = false;
    });
};

const getClinicDataByQuery = () => {
  resetPaginationData();
  if (!searchQuery.value) {
    getClinicData();
    return;
  }
  loadingClinic.value = true;
  getClinicByName(searchQuery.value)
    .then((response) => {
      if (!response) return;
      Clinics.value = response;
    })
    .finally(() => {
      loadingClinic.value = false;
    });
};

const handleOnClinicAdd = () => {
  router.push({ name: "ClinicAdd" });
};

const handleOnClinicEdit = (ClinicId: number) => {
  router.push({ name: "ClinicEdit", params: { id: ClinicId } });
};

const handleOnClinicDelete = () => {
  loadingDeleteClinic.value = true;
  deleteClinic(selectedClinic.value!.id)
    .then(() => {
      getClinicData(
        paginationData.value.currentPage,
        paginationData.value.limit
      );
    })
    .finally(() => {
      loadingDeleteClinic.value = false;
      modalDeleteOpen.value = false;
    });
};

const openDeleteModal = (ClinicId: number) => {
  selectedClinic.value = Clinics.value.find(
    (Clinic) => Clinic.id === ClinicId
  )!;
  modalDeleteOpen.value = true;
};

const toPreviousPage = () => {
  router.push({ name: "Home" });
};

onMounted(() => {
  getClinicData();
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
      <h1 class="text-2xl font-medium">Daftar Klinik</h1>
    </div>
    <button
      type="button"
      @click="handleOnClinicAdd"
      class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg lg:w-max hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      <PlusIcon class="w-4 h-4"></PlusIcon>
      <span>Tambah Klinik</span>
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
        :loading="loadingClinic"
        @click="getClinicDataByQuery"
        class="px-4 py-1 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-blue-200 disabled:text-blue-600"
      >
        Cari
      </LoadingButton>
    </div>
    <!-- table -->
    <div v-if="Clinics.length">
      <ResponsiveTable v-if="tableData">
        <template v-slot:header>
          <TableHead
            v-for="(header, i) in tableData.header"
            :key="'Clinic-table-header' + i"
          >
            {{ header }}
          </TableHead>
          <TableHead>Aksi</TableHead>
        </template>
        <template v-slot:body>
          <TableRowBody
            v-for="(row, i) in tableData.row"
            :key="'Clinic-table-row-' + i"
          >
            <TableBody v-for="(col, j) in row" :key="'Clinic-table-col-' + j"
              >{{ col }}
            </TableBody>
            <TableBody class="flex items-center justify-end">
              <Menu as="div" class="relative inline-block text-left">
                <div>
                  <MenuButton
                    class="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <ThreeDotIcon class="w-5 h-5"></ThreeDotIcon>
                  </MenuButton>
                </div>

                <transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <MenuItems
                    class="absolute right-0 z-30 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none"
                  >
                    <div class="px-1 py-1">
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="handleOnClinicEdit(Clinics[i].id)"
                          :class="[
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-gray-900',
                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                          ]"
                        >
                          <EditIcon
                            class="w-5 h-5 mr-2 text-violet-400"
                            aria-hidden="true"
                          />
                          Edit
                        </button>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="openDeleteModal(Clinics[i].id)"
                          :class="[
                            active
                              ? 'bg-violet-500 text-white'
                              : 'text-gray-900',
                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                          ]"
                        >
                          <TrashIcon
                            class="w-5 h-5 mr-2 text-violet-400"
                            aria-hidden="true"
                          />
                          Hapus
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </TableBody>
          </TableRowBody>
        </template>
      </ResponsiveTable>
      <Pagination
        :current-page="paginationData.currentPage"
        :total-pages="paginationData.totalPage"
        :total-items="paginationData.totalItems"
        :limit="paginationData.limit"
        @page-change="getClinicData"
      ></Pagination>
    </div>
    <EmptyData v-else></EmptyData>
  </div>
  <ConfirmDialog
    v-model="modalDeleteOpen"
    title="Hapus Klinik"
    button-text="Hapus"
    :loading-confirm="loadingDeleteClinic"
    @confirm="handleOnClinicDelete"
  >
    konfirmasi untuk menghapus,
    <span class="font-medium">{{ selectedClinic?.name }}</span>
  </ConfirmDialog>
</template>

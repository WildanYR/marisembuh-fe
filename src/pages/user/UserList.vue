<script setup lang="ts">
import { Ref, computed, onBeforeUnmount, onMounted, ref } from "vue";
import PlusIcon from "../../components/icon/PlusIcon.vue";
import {
  IUserResponse,
  deleteUser,
  getAllUserWithPagination,
  getUserByName,
} from "../../services/user.service";
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
import { DEBOUNCE_TIMEOUT } from "../../configs/debounce.config";

const debouncer = new Debouncer();
const router = useRouter();

const Users: Ref<IUserResponse[]> = ref([]);
const selectedUser: Ref<IUserResponse | null> = ref(null);
const paginationData: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 10,
  totalItems: 0,
  totalPage: 1,
});
const searchQuery = ref("");
const loadingUser = ref(false);
const loadingDeleteUser = ref(false);
const modalDeleteOpen = ref(false);

const tableData = computed(() => {
  if (!Users.value.length) return null;
  const row = Users.value.map((user) => {
    return [user.email, user.name, user.role];
  });
  return {
    header: ["Email", "Nama", "Role"],
    row,
  };
});

const resetPaginationData = () => {
  paginationData.value.currentPage = 1;
  paginationData.value.limit = 10;
  paginationData.value.totalItems = 0;
  paginationData.value.totalPage = 1;
};

const getUserData = (page = 1, limit = 10) => {
  loadingUser.value = true;
  getAllUserWithPagination({ page, limit })
    .then((response) => {
      if (!response) return;
      Users.value = response.items;
      paginationData.value = response.paginationData;
    })
    .finally(() => {
      loadingUser.value = false;
    });
};

const getUserDataByQuery = () => {
  resetPaginationData();
  if (!searchQuery.value) {
    getUserData();
    return;
  }
  loadingUser.value = true;
  getUserByName(searchQuery.value)
    .then((response) => {
      if (!response) return;
      Users.value = response;
    })
    .finally(() => {
      loadingUser.value = false;
    });
};

const handleOnUserAdd = () => {
  router.push({ name: "UserAdd" });
};

const handleOnUserEdit = (UserId: number) => {
  router.push({ name: "UserEdit", params: { id: UserId } });
};

const handleOnUserDelete = () => {
  loadingDeleteUser.value = true;
  deleteUser(selectedUser.value!.id)
    .then(() => {
      getUserData(paginationData.value.currentPage, paginationData.value.limit);
    })
    .finally(() => {
      loadingDeleteUser.value = false;
      modalDeleteOpen.value = false;
    });
};

const openDeleteModal = (UserId: number) => {
  selectedUser.value = Users.value.find((User) => User.id === UserId)!;
  modalDeleteOpen.value = true;
};

const toPreviousPage = () => {
  router.push({ name: "Home" });
};

const onSearch = debouncer.debounce(() => {
  getUserDataByQuery();
}, DEBOUNCE_TIMEOUT);

onMounted(() => {
  getUserData();
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
        <h1 class="text-2xl font-medium">Daftar User</h1>
      </div>
      <button
        type="button"
        @click="handleOnUserAdd"
        class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg lg:w-max hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        <PlusIcon class="w-4 h-4"></PlusIcon>
        <span>Tambah User</span>
      </button>
    </div>
    <div class="mt-5">
      <div class="flex justify-end gap-2 mb-3">
        <!-- search bar -->
        <TextSearch
          label="Cari nama"
          v-model="searchQuery"
          @update:model-value="onSearch"
          class="w-full lg:w-max"
        />
      </div>
      <!-- table -->
      <div v-if="Users.length">
        <ResponsiveTable v-if="tableData">
          <template v-slot:header>
            <TableHead
              v-for="(header, i) in tableData.header"
              :key="'User-table-header' + i"
            >
              {{ header }}
            </TableHead>
            <TableHead>Aksi</TableHead>
          </template>
          <template v-slot:body>
            <TableRowBody
              v-for="(row, i) in tableData.row"
              :key="'User-table-row-' + i"
            >
              <TableBody v-for="(col, j) in row" :key="'User-table-col-' + j"
                >{{ col }}
              </TableBody>
              <TableBody class="flex items-center gap-3">
                <button
                  @click="handleOnUserEdit(Users[i].id)"
                  class="flex items-center gap-1 px-4 py-1 text-sm rounded-md text-amber-900 bg-amber-100 hover:bg-amber-200 group"
                >
                  Edit
                </button>
                <button
                  @click="openDeleteModal(Users[i].id)"
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
          @page-change="getUserData"
        ></Pagination>
      </div>
      <EmptyData v-else></EmptyData>
    </div>
  </div>
  <ConfirmDialog
    v-model="modalDeleteOpen"
    title="Hapus User"
    button-text="Hapus"
    :loading-confirm="loadingDeleteUser"
    @confirm="handleOnUserDelete"
  >
    konfirmasi untuk menghapus,
    <span class="font-medium">{{ selectedUser?.name }}</span>
  </ConfirmDialog>
</template>

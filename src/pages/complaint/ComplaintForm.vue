<script setup lang="ts">
import { Ref, computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Validator } from "../../validator";
import isRequired from "../../validator/isRequired.validator";
import {
  createComplaint,
  getComplaintById,
  updateComplaint,
} from "../../services/complaint.service";
import TextInput from "../../components/form/TextInput.vue";
import LoadingButton from "../../components/LoadingButton.vue";
import SelectDialog from "../../components/form/SelectDialog.vue";
import {
  IMeridianResponse,
  getAllMeridianWithPagination,
  getMeridianByName,
} from "../../services/meridian.service";
import { IPaginationData } from "../../types/pagination.type";

const router = useRouter();
const route = useRoute();

const formData = reactive({
  name: "",
  meridian_id: null,
});
const formDataError = reactive({
  name: [],
});
const meridianList: Ref<IMeridianResponse[]> = ref([]);
const meridianPagination: Ref<IPaginationData> = ref({
  currentPage: 1,
  limit: 20,
  totalItems: 0,
  totalPage: 1,
});
const selectedMeridian: Ref<IMeridianResponse | null> = ref(null);
const loadingGetComplaint = ref(false);
const loadingGetMeridian = ref(false);
const loadingSubmit = ref(false);

const readOnly = computed(() => {
  if (route.meta.readOnly) return true;
  return false;
});

const handleAddComplaint = () => {
  const validator = new Validator();
  validator.addValidation("name", formData.name, [isRequired]);
  if (validator.validate()) {
    formDataError.name = validator.getError("name") as any;
    return;
  }
  loadingSubmit.value = true;
  createComplaint({ ...formData })
    .then(() => {
      router.back();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleEditComplaint = () => {
  const validator = new Validator();
  validator.addValidation("name", formData.name, [isRequired]);
  if (validator.validate()) {
    formDataError.name = validator.getError("name") as any;
    return;
  }
  loadingSubmit.value = true;
  updateComplaint(parseInt(route.params.id as any), { ...formData })
    .then(() => {
      router.back();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleSubmit = () => {
  if (route.name === "ComplaintAdd") {
    handleAddComplaint();
  } else {
    handleEditComplaint();
  }
};

const getMeridianData = () => {
  loadingGetMeridian.value = true;
  const firstGet =
    meridianPagination.value.currentPage === 1 &&
    meridianPagination.value.totalItems === 0;
  const page = firstGet ? 1 : meridianPagination.value.currentPage + 1;
  getAllMeridianWithPagination({
    limit: meridianPagination.value.limit,
    page,
  })
    .then((response) => {
      if (!response) return;
      if (firstGet) {
        meridianList.value = response.items;
      } else {
        meridianList.value.push(...response.items);
      }
      meridianPagination.value.currentPage =
        response.paginationData.currentPage;
      meridianPagination.value.limit = response.paginationData.limit;
      meridianPagination.value.totalItems = response.paginationData.totalItems;
      meridianPagination.value.totalPage = response.paginationData.totalPage;
    })
    .finally(() => {
      loadingGetMeridian.value = false;
    });
};

const searchMeridian = (name: string) => {
  meridianPagination.value.currentPage = 1;
  meridianPagination.value.limit = 20;
  meridianPagination.value.totalItems = 0;
  meridianPagination.value.totalPage = 1;
  if (!name) {
    getMeridianData();
    return;
  }
  loadingGetMeridian.value = true;
  getMeridianByName(name)
    .then((response) => {
      if (!response) return;
      meridianList.value = response;
    })
    .finally(() => {
      loadingGetMeridian.value = false;
    });
};

const onSelectMeridian = (meridian: IMeridianResponse) => {
  formData.meridian_id = meridian.id as any;
};

const onClearSelectedMeridian = () => {
  formData.meridian_id = null;
  selectedMeridian.value = null;
};

onMounted(() => {
  if (route.params.id) {
    loadingGetComplaint.value = true;
    getComplaintById(parseInt(route.params.id as any))
      .then((response) => {
        if (!response) return;
        formData.name = response.name;
        if (response.meridian?.id) {
          selectedMeridian.value = response.meridian;
          formData.meridian_id = response.meridian.id as any;
        }
      })
      .finally(() => {
        loadingGetComplaint.value = false;
      });
  }
  getMeridianData();
});
</script>

<template>
  <div
    class="w-full max-w-xl p-6 mx-auto mb-24 bg-white shadow-lg mt-14 rounded-xl"
  >
    <h1 class="mb-6 text-4xl font-medium text-center">
      {{ route.meta.title }}
    </h1>
    <div class="space-y-4">
      <TextInput
        v-model="formData.name"
        label="Nama Keluhan"
        :disabled="readOnly"
        :error-message="formDataError.name"
      ></TextInput>
      <SelectDialog
        v-model="selectedMeridian"
        label="Meridian"
        display-key="name"
        select-key="id"
        :items="meridianList"
        :max-page="
          meridianPagination.currentPage === meridianPagination.totalPage
        "
        :loading="loadingGetMeridian"
        :disabled="readOnly"
        @update:model-value="onSelectMeridian"
        @show-more="getMeridianData"
        @search="searchMeridian"
        @clear-selected="onClearSelectedMeridian"
      ></SelectDialog>
      <LoadingButton
        v-if="!readOnly"
        :loading="loadingSubmit"
        @click="handleSubmit"
        class="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-blue-200 disabled:text-blue-600"
      >
        {{ route.meta.title }}
      </LoadingButton>
    </div>
  </div>
</template>

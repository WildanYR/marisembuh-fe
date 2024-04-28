<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
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
import SingleMeridianSelect from "../../components/form/custom_data/SingleMeridianSelect.vue";
import GrayButton from "../../components/button/GrayButton.vue";
import { cacheFormDataKey } from "../../configs";

const router = useRouter();
const route = useRoute();

const formData = ref({
  name: "",
  meridian_id: null,
});
const formDataError = reactive({
  name: [],
});
const selectedMeridian = ref(null);
const loadingGetComplaint = ref(false);
const loadingSubmit = ref(false);

const showModalMeridian = ref(false);

const readOnly = computed(() => {
  if (route.meta.readOnly) return true;
  return false;
});

const handleAddComplaint = () => {
  const validator = new Validator();
  validator.addValidation("name", formData.value.name, [isRequired]);
  if (validator.validate()) {
    formDataError.name = validator.getError("name") as any;
    return;
  }
  loadingSubmit.value = true;
  createComplaint({ ...formData.value })
    .then(() => {
      toPreviousPage();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleEditComplaint = () => {
  const validator = new Validator();
  validator.addValidation("name", formData.value.name, [isRequired]);
  if (validator.validate()) {
    formDataError.name = validator.getError("name") as any;
    return;
  }
  loadingSubmit.value = true;
  updateComplaint(parseInt(route.params.id as any), { ...formData.value })
    .then(() => {
      toPreviousPage();
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

const onSelectMeridian = (meridian: any) => {
  formData.value.meridian_id = meridian.id;
};

const setCacheFormData = () => {
  const cache = {
    formData: formData.value,
    selectedMeridian: selectedMeridian.value,
  };
  localStorage.setItem(cacheFormDataKey, JSON.stringify(cache));
};
const getCacheFormData = () => {
  const cacheStr = localStorage.getItem(cacheFormDataKey);
  if (!cacheStr) return;
  const cache = JSON.parse(cacheStr);

  formData.value = cache.formData;
  selectedMeridian.value = cache.selectedMeridian;

  localStorage.removeItem(cacheFormDataKey);
};

const handleAddMeridian = () => {
  setCacheFormData();
  const ref = {
    name: route.name,
    params: route.params,
    query: { ...route.query, om: "meridian" },
  };
  const refStr = encodeURIComponent(JSON.stringify(ref));
  router.push({ name: "MeridianAdd", query: { ref: refStr } });
};

const toPreviousPage = () => {
  if (route.query.ref) {
    const ref = JSON.parse(decodeURIComponent(route.query.ref as string));
    router.push(ref);
  } else {
    router.push({ name: "ComplaintList" });
  }
};

onMounted(() => {
  getCacheFormData();
  if (route.query.om === "meridian") {
    showModalMeridian.value = true;
  }
  if (route.params.id) {
    loadingGetComplaint.value = true;
    getComplaintById(parseInt(route.params.id as any))
      .then((response) => {
        if (!response) return;
        formData.value.name = response.name;
        if (response.meridian?.id) {
          selectedMeridian.value = response.meridian as any;
          formData.value.meridian_id = response.meridian.id as any;
        }
      })
      .finally(() => {
        loadingGetComplaint.value = false;
      });
  }
});
</script>

<template>
  <div
    class="w-full max-w-xl p-6 mx-auto mb-24 bg-white shadow-lg mt-14 rounded-xl"
  >
    <h1 class="mb-3 text-4xl font-medium text-center">
      {{ route.meta.title }}
    </h1>
    <div class="flex items-center justify-center mb-3">
      <GrayButton @click="toPreviousPage" class="text-sm">Kembali</GrayButton>
    </div>
    <div class="space-y-4">
      <TextInput
        v-model="formData.name"
        label="Nama Keluhan"
        :disabled="readOnly"
        :error-message="formDataError.name"
      ></TextInput>
      <SingleMeridianSelect
        label="Meridian"
        v-model="selectedMeridian"
        v-model:modal-show="showModalMeridian"
        :disabled="readOnly"
        @update:model-value="onSelectMeridian"
        @add-data="handleAddMeridian"
      />
      <div class="pt-3 space-y-4">
        <LoadingButton
          v-show="!readOnly"
          :loading="loadingSubmit"
          @click="handleSubmit"
          class="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-blue-200 disabled:text-blue-600"
        >
          {{ route.meta.title }}
        </LoadingButton>
        <GrayButton @click="toPreviousPage" class="w-full">Kembali</GrayButton>
      </div>
    </div>
  </div>
</template>

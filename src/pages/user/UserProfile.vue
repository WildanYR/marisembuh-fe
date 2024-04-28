<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Validator } from "../../validator";
import isRequired from "../../validator/isRequired.validator";
import {
  createUser,
  getUserById,
  updateUser,
} from "../../services/user.service";
import TextInput from "../../components/form/TextInput.vue";
import LoadingButton from "../../components/LoadingButton.vue";
import GrayButton from "../../components/button/GrayButton.vue";
import SingleClinicSelect from "../../components/form/custom_data/SingleClinicSelect.vue";
import { useAuthStore } from "../../stores/auth.store";
import { cacheFormDataKey } from "../../configs";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const formData = ref({
  email: "",
  password: "",
  name: "",
  clinic_id: null,
});
const formDataError = reactive({
  email: [],
  password: [],
  name: [],
  clinic: [],
});

const selectedClinic = ref(null);

const loadingGetUser = ref(false);
const loadingSubmit = ref(false);

const showModalClinic = ref(false);

const readOnly = computed(() => {
  if (route.meta.readOnly) return true;
  return false;
});

const handleAddUser = () => {
  const validator = new Validator();
  validator.addValidation("email", formData.value.email, [isRequired]);
  validator.addValidation("password", formData.value.password, [isRequired]);
  validator.addValidation("name", formData.value.name, [isRequired]);
  validator.addValidation("clinic", formData.value.clinic_id, [isRequired]);
  if (validator.validate()) {
    formDataError.email = validator.getError("email") as any;
    formDataError.password = validator.getError("password") as any;
    formDataError.name = validator.getError("name") as any;
    formDataError.clinic = validator.getError("clinic") as any;
    return;
  }
  loadingSubmit.value = true;
  createUser({ ...(formData.value as any) })
    .then(() => {
      toPreviousPage();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleEditUser = () => {
  loadingSubmit.value = true;
  const { password, ...editData } = formData.value;
  if (password) (editData as any).password = password;
  updateUser(authStore.id, { ...(editData as any) })
    .then(() => {
      authStore.clinic_id = formData.value.clinic_id as any;
      toPreviousPage();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleSubmit = () => {
  if (route.name === "UserAdd") {
    handleAddUser();
  } else {
    handleEditUser();
  }
};

const toPreviousPage = () => {
  router.push({ name: "Home" });
};

const onSelectClinic = (clinic: any) => {
  formData.value.clinic_id = clinic.id || null;
};

const setCacheFormData = () => {
  const cache = {
    formData: formData.value,
    selectedClinic: selectedClinic.value,
  };
  localStorage.setItem(cacheFormDataKey, JSON.stringify(cache));
};
const getCacheFormData = () => {
  const cacheStr = localStorage.getItem(cacheFormDataKey);
  if (!cacheStr) return;
  const cache = JSON.parse(cacheStr);

  formData.value = cache.formData;
  selectedClinic.value = cache.selectedClinic;

  localStorage.removeItem(cacheFormDataKey);
};

const handleAddClinicData = () => {
  setCacheFormData();
  const ref = {
    name: route.name,
    params: route.params,
    query: { ...route.query, om: "clinic" },
  };
  const refStr = encodeURIComponent(JSON.stringify(ref));
  router.push({ name: "ClinicAdd", query: { ref: refStr } });
};

onMounted(() => {
  getCacheFormData();
  loadingGetUser.value = true;
  getUserById(authStore.id)
    .then((response) => {
      if (!response) return;
      formData.value.email = response.email;
      formData.value.name = response.name;
      formData.value.clinic_id = response.clinic_id as any;
      selectedClinic.value = {
        id: response.clinic.id,
        name: response.clinic.name,
      } as any;
    })
    .finally(() => {
      loadingGetUser.value = false;
    });
});
</script>

<template>
  <div
    class="w-full max-w-xl p-6 mx-auto mb-24 bg-white shadow-lg mt-14 rounded-xl"
  >
    <h1 class="mb-3 text-4xl font-medium text-center">Profil</h1>
    <div class="flex items-center justify-center mb-3">
      <GrayButton @click="toPreviousPage" class="text-sm">Kembali</GrayButton>
    </div>
    <div class="space-y-4">
      <TextInput
        v-model="formData.email"
        label="Email"
        :disabled="readOnly"
        :error-message="formDataError.email"
      ></TextInput>
      <TextInput
        v-model="formData.password"
        label="Password"
        type="password"
        :disabled="readOnly"
        :error-message="formDataError.password"
      ></TextInput>
      <TextInput
        v-model="formData.name"
        label="Nama"
        :disabled="readOnly"
        :error-message="formDataError.name"
      ></TextInput>
      <SingleClinicSelect
        label="Klinik"
        v-model="selectedClinic"
        v-model:modal-show="showModalClinic"
        :disabled="readOnly"
        @update:model-value="onSelectClinic"
        @add-data="handleAddClinicData"
      />
      <div class="pt-3 space-y-4">
        <LoadingButton
          v-show="!readOnly"
          :loading="loadingSubmit"
          @click="handleSubmit"
          class="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-blue-200 disabled:text-blue-600"
        >
          Edit Profil
        </LoadingButton>
        <GrayButton @click="toPreviousPage" class="w-full">Kembali</GrayButton>
      </div>
    </div>
  </div>
</template>

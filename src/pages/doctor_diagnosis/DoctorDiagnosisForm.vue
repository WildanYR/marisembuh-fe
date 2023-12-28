<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Validator } from "../../validator";
import isRequired from "../../validator/isRequired.validator";
import {
  createDoctorDiagnosis,
  getDoctorDiagnosisById,
  updateDoctorDiagnosis,
} from "../../services/doctor_diagnosis.service";
import TextInput from "../../components/form/TextInput.vue";
import LoadingButton from "../../components/LoadingButton.vue";

const router = useRouter();
const route = useRoute();

const formData = reactive({
  name: "",
});
const formDataError = reactive({
  name: [],
});
const loadingGetDoctorDiagnosis = ref(false);
const loadingSubmit = ref(false);

const readOnly = computed(() => {
  if (route.meta.readOnly) return true;
  return false;
});

const handleAddDoctorDiagnosis = () => {
  const validator = new Validator();
  validator.addValidation("name", formData.name, [isRequired]);
  if (validator.validate()) {
    formDataError.name = validator.getError("name") as any;
    return;
  }
  loadingSubmit.value = true;
  createDoctorDiagnosis({ ...formData })
    .then(() => {
      router.back();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleEditDoctorDiagnosis = () => {
  const validator = new Validator();
  validator.addValidation("name", formData.name, [isRequired]);
  if (validator.validate()) {
    formDataError.name = validator.getError("name") as any;
    return;
  }
  loadingSubmit.value = true;
  updateDoctorDiagnosis(parseInt(route.params.id as any), { ...formData })
    .then(() => {
      router.back();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleSubmit = () => {
  if (route.name === "DoctorDiagnosisAdd") {
    handleAddDoctorDiagnosis();
  } else {
    handleEditDoctorDiagnosis();
  }
};

onMounted(() => {
  if (route.params.id) {
    loadingGetDoctorDiagnosis.value = true;
    getDoctorDiagnosisById(parseInt(route.params.id as any))
      .then((response) => {
        if (!response) return;
        formData.name = response.name;
      })
      .finally(() => {
        loadingGetDoctorDiagnosis.value = false;
      });
  }
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
        label="Nama Diagnosa Dokter"
        :disabled="readOnly"
        :error-message="formDataError.name"
      ></TextInput>
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

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Validator } from "../../validator";
import isRequired from "../../validator/isRequired.validator";
import LoadingButton from "../../components/LoadingButton.vue";
import GrayButton from "../../components/button/GrayButton.vue";
import SinglePatientSelect from "../../components/form/custom_data/SinglePatientSelect.vue";
import SingleUserSelect from "../../components/form/custom_data/SingleUserSelect.vue";
import { createPatientArrival } from "../../services/patient_arrival.service";
import { useAuthStore } from "../../stores/auth.store";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const formData = reactive({
  patient_id: null,
  user_id: null,
  tag_user_id: null,
});
const formDataError = reactive({
  patient: [],
  user: [],
});

const selectedPatient = ref(null);
const selectedUser = ref(null);

const showModalPatient = ref(false);
const showModalUser = ref(false);

const loadingSubmit = ref(false);

const readOnly = computed(() => {
  if (route.meta.readOnly) return true;
  return false;
});

const handleSubmit = () => {
  const validator = new Validator();
  validator.addValidation("patient", formData.patient_id, [isRequired]);
  validator.addValidation("user", formData.user_id, [isRequired]);
  if (validator.validate()) {
    formDataError.patient = validator.getError("patient") as any;
    formDataError.user = validator.getError("user") as any;
    return;
  }
  loadingSubmit.value = true;
  formData.tag_user_id = authStore.id as any;
  createPatientArrival({ ...(formData as any) })
    .then(() => {
      toPreviousPage();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const toPreviousPage = () => {
  router.push({ name: "PatientArrivalList" });
};

const onSelectPatient = (item: any) => {
  formData.patient_id = item.id || null;
};
const onAddPatient = () => {
  const ref = {
    name: route.name,
    params: route.params,
    query: { ...route.query, om: "patient" },
  };
  const refStr = encodeURIComponent(JSON.stringify(ref));
  router.push({ name: "PatientAdd", query: { ref: refStr } });
};

const onSelectUser = (item: any) => {
  formData.user_id = item.id || null;
};

onMounted(() => {
  if (route.query.om === "patient") {
    showModalPatient.value = true;
  }
});
</script>

<template>
  <div
    class="w-full max-w-xl p-6 mx-auto mb-24 bg-white shadow-lg mt-14 rounded-xl"
  >
    <h1 class="mb-3 text-4xl font-medium text-center">
      Tambah Kedatangan Pasien
    </h1>
    <div class="flex items-center justify-center mb-3">
      <GrayButton @click="toPreviousPage" class="text-sm">Kembali</GrayButton>
    </div>
    <div class="space-y-4">
      <SinglePatientSelect
        label="Pasien"
        v-model="selectedPatient"
        v-model:modal-show="showModalPatient"
        :disabled="readOnly"
        @update:model-value="onSelectPatient"
        @add-patient="onAddPatient"
      />
      <SingleUserSelect
        label="Terapis"
        v-model="selectedUser"
        v-model:modal-show="showModalUser"
        :disabled="readOnly"
        @update:model-value="onSelectUser"
      />
      <div class="pt-3 space-y-4">
        <LoadingButton
          v-show="!readOnly"
          :loading="loadingSubmit"
          @click="handleSubmit"
          class="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-blue-200 disabled:text-blue-600"
        >
          Tambah Kedatangan Pasien
        </LoadingButton>
        <GrayButton @click="toPreviousPage" class="w-full">Kembali</GrayButton>
      </div>
    </div>
  </div>
</template>

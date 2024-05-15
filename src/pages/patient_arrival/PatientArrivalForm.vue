<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Validator } from "../../validator";
import isRequired from "../../validator/isRequired.validator";
import LoadingButton from "../../components/LoadingButton.vue";
import GrayButton from "../../components/button/GrayButton.vue";
import SinglePatientSelect from "../../components/form/custom_data/SinglePatientSelect.vue";
import SingleUserSelect from "../../components/form/custom_data/SingleUserSelect.vue";
import {
  createPatientArrival,
  getPatientArrivalById,
  updatePatientArrival,
} from "../../services/patient_arrival.service";
import { useAuthStore } from "../../stores/auth.store";
import { cacheFormDataKey } from "../../configs";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";
import { id as dateLocalId } from "date-fns/locale";
import {
  formatSQLStringDate,
  formatISOStringDate,
} from "../../utils/date.util";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const formData = ref({
  patient_id: null,
  user_id: null,
  tag_user_id: null,
  type: "KLINIK",
  date: "",
});
const formDataError = reactive({
  patient: [],
  user: [],
  type: [],
});

const selectedPatient = ref(null);
const selectedUser = ref(null);

const showModalPatient = ref(false);
const showModalUser = ref(false);

const loadingSubmit = ref(false);
const loadingGetPatientArrival = ref(false);

const readOnly = computed(() => {
  if (route.meta.readOnly) return true;
  return false;
});

const handleAddPatientArrival = () => {
  const validator = new Validator();
  validator.addValidation("patient", formData.value.patient_id, [isRequired]);
  validator.addValidation("user", formData.value.user_id, [isRequired]);
  validator.addValidation("type", formData.value.type, [isRequired]);
  if (validator.validate()) {
    formDataError.patient = validator.getError("patient") as any;
    formDataError.user = validator.getError("user") as any;
    return;
  }
  loadingSubmit.value = true;
  formData.value.tag_user_id = authStore.id as any;
  const ISODate = formatISOStringDate(formData.value.date);
  createPatientArrival({ ...(formData.value as any), date: ISODate })
    .then(() => {
      toPreviousPage();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleEditPatientArrival = () => {
  loadingSubmit.value = true;
  const patientArrivalId = parseInt(route.params.id as string);
  const ISODate = formData.value.date
    ? formatISOStringDate(formData.value.date)
    : null;
  updatePatientArrival(patientArrivalId, {
    ...(formData.value as any),
    date: ISODate,
  })
    .then(() => {
      toPreviousPage();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleSubmit = () => {
  if (route.name === "PatientArrivalAdd") {
    handleAddPatientArrival();
  } else {
    handleEditPatientArrival();
  }
};

const toPreviousPage = () => {
  router.push({ name: "PatientArrivalList" });
};

const onSelectPatient = (item: any) => {
  formData.value.patient_id = item.id || null;
};
const onSelectUser = (item: any) => {
  formData.value.user_id = item.id || null;
};

const getPatientArrivalData = (patientArrivalId: number) => {
  loadingGetPatientArrival.value = true;
  getPatientArrivalById(patientArrivalId)
    .then((response) => {
      console.log(response);
      formData.value.patient_id = response.patient.id as any;
      formData.value.tag_user_id = response.tag_user.id as any;
      formData.value.user_id = response.user.id as any;
      formData.value.type = response.type;
      selectedPatient.value = response.patient as any;
      selectedUser.value = response.user as any;
    })
    .finally(() => {
      loadingGetPatientArrival.value = false;
    });
};

const setCacheFormData = () => {
  const cache = {
    formData: formData.value,
    selectedPatient: selectedPatient.value,
    selectedUser: selectedUser.value,
  };
  localStorage.setItem(cacheFormDataKey, JSON.stringify(cache));
};
const getCacheFormData = () => {
  const cacheStr = localStorage.getItem(cacheFormDataKey);
  if (!cacheStr) return false;
  const cache = JSON.parse(cacheStr);

  formData.value = cache.formData;
  selectedPatient.value = cache.selectedPatient;
  selectedUser.value = cache.selectedUser;

  localStorage.removeItem(cacheFormDataKey);
  return true;
};

const onAddPatient = () => {
  setCacheFormData();
  const ref = {
    name: route.name,
    params: route.params,
    query: { ...route.query, om: "patient" },
  };
  const refStr = encodeURIComponent(JSON.stringify(ref));
  router.push({ name: "PatientAdd", query: { ref: refStr } });
};

onMounted(() => {
  if (!getCacheFormData() && route.params.id) {
    getPatientArrivalData(parseInt(route.params.id as string));
  } else if (!formData.value.date) {
    formData.value.date = formatSQLStringDate(new Date());
  }
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
      {{ route.meta.title }}
    </h1>
    <div class="flex items-center justify-center mb-3">
      <GrayButton @click="toPreviousPage" class="text-sm">Kembali</GrayButton>
    </div>
    <div class="space-y-4">
      <!-- Jenis Perawatan -->
      <RadioGroup v-model="formData.type" :disabled="readOnly">
        <RadioGroupLabel class="font-medium">Jenis Perawatan</RadioGroupLabel>
        <div class="flex items-center gap-3 mt-3 md:gap-5">
          <RadioGroupOption
            as="template"
            value="KLINIK"
            v-slot="{ active, checked }"
          >
            <div
              :class="[
                active
                  ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                  : '',
                checked
                  ? 'bg-sky-500/75 text-white '
                  : 'bg-white border border-gray-200',
              ]"
              class="relative flex items-center justify-center w-full px-5 py-3 rounded-lg cursor-pointer focus:outline-none"
            >
              <RadioGroupLabel>Klinik</RadioGroupLabel>
            </div>
          </RadioGroupOption>
          <RadioGroupOption
            as="template"
            value="HOMECARE"
            v-slot="{ active, checked }"
          >
            <div
              :class="[
                active
                  ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                  : '',
                checked
                  ? 'bg-sky-500/75 text-white '
                  : 'bg-white border border-gray-200',
              ]"
              class="relative flex items-center justify-center w-full px-5 py-3 rounded-lg cursor-pointer focus:outline-none"
            >
              <RadioGroupLabel>Homecare</RadioGroupLabel>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
      <!-- Tanggal Perawatan -->
      <div>
        <p class="mb-3 text-gray-700">Tanggal Lahir</p>
        <VueDatePicker
          v-model="formData.date"
          model-type="yyyy-MM-dd"
          placeholder="Pilih tanggal"
          locale="id"
          format="dd MMMM yyyy"
          :format-locale="dateLocalId"
          :enable-time-picker="false"
          :readonly="readOnly"
          auto-apply
        />
      </div>
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
          {{ route.meta.title }}
        </LoadingButton>
        <GrayButton @click="toPreviousPage" class="w-full">Kembali</GrayButton>
      </div>
    </div>
  </div>
</template>

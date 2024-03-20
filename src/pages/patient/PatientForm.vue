<script setup lang="ts">
import { Ref, computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Validator } from "../../validator";
import isRequired from "../../validator/isRequired.validator";
import {
  createPatient,
  getPatientById,
  updatePatient,
} from "../../services/patient.service";
import { useAuthStore } from "../../stores/auth.store";
import {
  IClinicResponse,
  getAllClinicWithPagination,
} from "../../services/clinic.service";
import TextInput from "../../components/form/TextInput.vue";
import LoadingButton from "../../components/LoadingButton.vue";
import { RadioGroup, RadioGroupOption, RadioGroupLabel } from "@headlessui/vue";
import SingleClinicSelect from "../../components/form/custom_data/SingleClinicSelect.vue";
import GrayButton from "../../components/button/GrayButton.vue";
import { id as dateLocalId } from "date-fns/locale";
import { calculateAgeFromBirthdate } from "../../utils/date.util";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const formData = reactive({
  name: "",
  gender: "",
  birthdate: "",
  address: "",
  telp: "",
  clinic_id: 0,
});
const formDataError = reactive({
  name: [],
});
const registeringUser = ref("");
const patientAge = ref(0);
const clinics: Ref<IClinicResponse[]> = ref([]);
const loadingGetPatient = ref(false);
const loadingGetClinic = ref(false);
const loadingSubmit = ref(false);

const selectedClinic = ref(null);

const showAge = ref(false);

const readOnly = computed(() => {
  if (route.meta.readOnly) return true;
  return false;
});

const handleAddPatient = () => {
  const validator = new Validator();
  validator.addValidation("name", formData.name, [isRequired]);
  if (validator.validate()) {
    formDataError.name = validator.getError("name") as any;
    return;
  }
  loadingSubmit.value = true;
  createPatient({ ...formData, user_id: authStore.id })
    .then(() => {
      router.back();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleEditPatient = () => {
  const validator = new Validator();
  validator.addValidation("name", formData.name, [isRequired]);
  if (validator.validate()) {
    formDataError.name = validator.getError("name") as any;
    return;
  }
  loadingSubmit.value = true;
  updatePatient(parseInt(route.params.id as any), {
    ...formData,
    user_id: authStore.id,
  })
    .then(() => {
      router.back();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleSubmit = () => {
  if (route.name === "PatientAdd") {
    handleAddPatient();
  } else {
    handleEditPatient();
  }
};

const onSelectClinic = (clinic: any) => {
  formData.clinic_id = clinic.id;
};

const toPreviousPage = () => {
  router.push({ name: "PatientList" });
};

onMounted(() => {
  if (route.params.id) {
    loadingGetPatient.value = true;
    getPatientById(parseInt(route.params.id as any))
      .then((response) => {
        if (!response) return;
        formData.name = response.name;
        formData.gender = response.gender;
        formData.birthdate = response.birthdate;
        formData.address = response.address;
        formData.telp = response.telp;
        formData.clinic_id = response.register_clinic.id;
        selectedClinic.value = response.register_clinic as any;
        // Detail
        registeringUser.value = response.registered_by
          ? response.registered_by.name
          : "";
        if (response.birthdate) {
          patientAge.value = calculateAgeFromBirthdate(response.birthdate);
          showAge.value = true;
        }
      })
      .finally(() => {
        loadingGetPatient.value = false;
      });
  }
  loadingGetClinic.value = true;
  getAllClinicWithPagination({ limit: 999 })
    .then((response) => {
      if (!response) return;
      clinics.value = response.items;
    })
    .finally(() => {
      loadingGetClinic.value = false;
    });
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
        label="Nama Pasien"
        :disabled="readOnly"
        :error-message="formDataError.name"
      ></TextInput>
      <RadioGroup v-model="formData.gender" :disabled="readOnly">
        <RadioGroupLabel class="text-gray-700">Jenis Kelamin</RadioGroupLabel>
        <div class="flex items-center gap-3 mt-3 lg:gap-5">
          <RadioGroupOption
            as="template"
            value="L"
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
              <RadioGroupLabel>Laki-laki</RadioGroupLabel>
            </div>
          </RadioGroupOption>
          <RadioGroupOption
            as="template"
            value="P"
            v-slot="{ active, checked }"
          >
            <div
              :class="[
                active
                  ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-pink-300'
                  : '',
                checked
                  ? 'bg-pink-500/75 text-white '
                  : 'bg-white border border-gray-200',
              ]"
              class="relative flex items-center justify-center w-full px-5 py-3 rounded-lg cursor-pointer focus:outline-none"
            >
              <RadioGroupLabel>Perempuan</RadioGroupLabel>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
      <div>
        <p class="mb-3 text-gray-700">Tanggal Lahir</p>
        <VueDatePicker
          v-model="formData.birthdate"
          model-type="yyyy-MM-dd"
          placeholder="Pilih tanggal"
          locale="id"
          format="dd MMMM yyyy"
          :format-locale="dateLocalId"
          :enable-time-picker="false"
          :flow="['year', 'month', 'calendar']"
          :readonly="readOnly"
          auto-apply
        />
      </div>
      <div
        v-if="readOnly && showAge"
        class="flex items-center justify-center w-full gap-1"
      >
        <p class="text-gray-700">
          Umur
          <span class="text-2xl font-medium">{{ patientAge }}</span>
        </p>
      </div>
      <TextInput
        v-model="formData.address"
        label="Alamat"
        :disabled="readOnly"
      ></TextInput>
      <TextInput
        v-model="formData.telp"
        label="No Telpon / WA"
        :disabled="readOnly"
      ></TextInput>
      <SingleClinicSelect
        label="Klinik"
        v-model="selectedClinic"
        :disabled="readOnly"
        @update:model-value="onSelectClinic"
      />
      <div v-if="readOnly">
        <p class="text-sm text-gray-700">Didaftarkan oleh</p>
        <p class="font-medium">{{ registeringUser }}</p>
      </div>
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

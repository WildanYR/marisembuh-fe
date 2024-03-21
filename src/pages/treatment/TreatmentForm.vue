<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Validator } from "../../validator";
import isRequired from "../../validator/isRequired.validator";
import {
  createTreatment,
  getTreatmentById,
  updateTreatment,
} from "../../services/treatment.service";
import { RadioGroup, RadioGroupOption, RadioGroupLabel } from "@headlessui/vue";
import TextInput from "../../components/form/TextInput.vue";
import LoadingButton from "../../components/LoadingButton.vue";
import MultiDoctorDiagnosisSelect from "../../components/form/custom_data/MultiDoctorDiagnosisSelect.vue";
import MultiMedicineSelect from "../../components/form/custom_data/MultiMedicineSelect.vue";
import MultiTherapyHistorySelect from "../../components/form/custom_data/MultiTherapyHistorySelect.vue";
import MultiSelfTherapySelect from "../../components/form/custom_data/MultiSelfTherapySelect.vue";
import MultiComplaintSelect from "../../components/form/custom_data/MultiComplaintSelect.vue";
import MultiStomachCheckupSelect from "../../components/form/custom_data/MultiStomachCheckupSelect.vue";
import MultiTongueCheckupSelect from "../../components/form/custom_data/MultiTongueCheckupSelect.vue";
import MultiTherapySelect from "../../components/form/custom_data/MultiTherapySelect.vue";
import SingleTreatmentPacketSelect from "../../components/form/custom_data/SingleTreatmentPacketSelect.vue";
import SingleDurationAdviceSelect from "../../components/form/custom_data/SingleDurationAdviceSelect.vue";
import TextArea from "../../components/form/TextArea.vue";
import { getPatientById } from "../../services/patient.service";
import GrayButton from "../../components/button/GrayButton.vue";
import { useAuthStore } from "../../stores/auth.store";
import SingleClinicSelect from "../../components/form/custom_data/SingleClinicSelect.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const editedFormKey = new Map();

const treatmentObjective = ref(["Preventif", "Kuratif", "Rehabilitatif"]);
const pulseCheckupDepth = ref([
  "Superfisial (Fu)",
  "Normal",
  "Dalam/Tenggelam (Chen)",
]);
const pulseCheckupSpeed = ref(["Cepat (Shu)", "Normal", "Lambat (Huan)"]);
const pulseCheckupPower = ref([
  "Sangat Kuat (Shi)",
  "Kuat Normal",
  "Lemah (Xu)",
]);
const pulseCheckupAbnormalType = ref([
  "Tegang (Xuan)",
  "Ketat (Jin)",
  "Licin (Hua)",
  "Seret (Se)",
  "Sangat Tipis (Wei)",
  "Kosong (Kong)",
]);
const pulseCheckupDiffLoc = ref(["Lemah", "Normal", "Kuat"]);

const formData = reactive({
  objective: "",
  blood_pressure: "",
  pulse_frequency: "",
  is_pregnant: false,
  duration_advice_id: null,
  patient_id: null,
  treatment_packet_id: null,
  evaluation: "",
  doctor_diagnosis: [],
  medicine: [],
  therapy_history: [],
  complaint: [],
  stomach_checkup: [],
  tongue_checkup: [],
  self_therapy: [],
  therapy: [],
  pulse_checkup: {
    depth: "",
    speed: "",
    power: "",
    abnormal_type: "",
    location_differentiation: "",
  },
  user_id: null,
  clinic_id: null,
});
const pulseLocationDifferentiation = ref({
  cun_left: "",
  guan_left: "",
  chi_left: "",
  cun_right: "",
  guan_right: "",
  chi_right: "",
});
const bloodPressureData = ref(["", ""]);
const isHomecareTreatment = ref(false);
const formDataError = reactive({
  objective: [],
});

const patientData = reactive({
  id: 0,
  no_rm: "",
  name: "",
  gender: "",
});

const selectedTreatmentPacket = ref(null);
const selectedDoctorDiagnosis = ref([]);
const selectedMedicine = ref([]);
const selectedTherapyHistory = ref([]);
const selectedComplaint = ref([]);
const selectedStomachCheckup = ref([]);
const selectedTongueCheckup = ref([]);
const selectedTherapy = ref([]);
const selectedSelfTherapy = ref([]);
const selectedDurationAdvice = ref(null);
const selectedClinic = ref(null);

const loadingGetTreatment = ref(false);
const loadingSubmit = ref(false);

const readOnly = computed(() => {
  if (route.meta.readOnly) return true;
  return false;
});

const handleAddTreatment = () => {
  const validator = new Validator();
  validator.addValidation("objective", formData.objective, [isRequired]);
  if (validator.validate()) {
    formDataError.objective = validator.getError("objective") as any;
    return;
  }
  loadingSubmit.value = true;
  if (!isHomecareTreatment.value) {
    formData.clinic_id = authStore.clinic_id as any;
  } else {
    formData.clinic_id = null;
  }
  createTreatment({ ...formData })
    .then(() => {
      router.back();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleEditTreatment = () => {
  loadingSubmit.value = true;
  const dataKey: string[] = Array.from(editedFormKey.keys());
  const editData = new Map();
  dataKey.forEach((value) => {
    editData.set(value, formData[value as keyof typeof formData]);
  });
  updateTreatment(
    parseInt(route.params.id as any),
    Object.fromEntries(editData)
  )
    .then(() => {
      router.back();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleSubmit = () => {
  if (route.name === "TreatmentAdd") {
    handleAddTreatment();
  } else {
    handleEditTreatment();
  }
};

const onSelectTreatmentPacket = (packet: any) => {
  formData.treatment_packet_id = packet.id;
  onEditDataChange("treatment_packet_id");
};
const onSelectDoctorDiagnosis = (doctorDiagnosis: any[]) => {
  formData.doctor_diagnosis = doctorDiagnosis.map((item) => item.id) as any;
  onEditDataChange("doctor_diagnosis");
};
const onSelectMedicine = (medicine: any[]) => {
  formData.medicine = medicine.map((item) => item.id) as any;
  onEditDataChange("medicine");
};
const onSelectTherapyHistory = (therapyHistory: any[]) => {
  formData.therapy_history = therapyHistory.map((item) => item.id) as any;
  onEditDataChange("therapy_history");
};
const onSelectSelfTherapy = (selfTherapy: any[]) => {
  formData.self_therapy = selfTherapy.map((item) => item.id) as any;
  onEditDataChange("self_therapy");
};
const onSelectComplaint = (complaint: any[]) => {
  formData.complaint = complaint.map((item) => item.id) as any;
  onEditDataChange("complaint");
};
const onSelectStomachCheckup = (stomachCheckup: any[]) => {
  formData.stomach_checkup = stomachCheckup.map((item) => item.id) as any;
  onEditDataChange("stomach_checkup");
};
const onSelectTongueCheckup = (tongueCheckup: any[]) => {
  formData.tongue_checkup = tongueCheckup.map((item) => item.id) as any;
  onEditDataChange("tongue_checkup");
};
const onSelectTherapy = (therapy: any[]) => {
  formData.therapy = therapy.map((item) => ({
    id: item.id,
    detail: item.detail,
  })) as any;
  onEditDataChange("therapy");
};
const onSelectDurationAdvice = (durationAdvice: any) => {
  formData.duration_advice_id = durationAdvice.id;
  onEditDataChange("duration_advice_id");
};
const onSelectClinic = (clinic: any) => {
  formData.clinic_id = clinic.id;
  onEditDataChange("clinic_id");
};

const onPulseLocDiffInput = () => {
  const diffLocArr = Object.values(pulseLocationDifferentiation.value);
  formData.pulse_checkup.location_differentiation = diffLocArr.join(";");
  onEditDataChange("pulse_checkup");
};
const onBloodPressureInput = () => {
  if (!bloodPressureData.value[0] && !bloodPressureData.value[1]) {
    formData.blood_pressure = "";
    return;
  }
  formData.blood_pressure = bloodPressureData.value.join("/");
};

const onEditDataChange = (key: string) => {
  editedFormKey.set(key, true);
};

const toPreviousPage = () => {
  let params: any = {};
  if ((route.meta.pageParams as string[])?.length) {
    (route.meta.pageParams as string[]).forEach((item) => {
      params[item] = route.params[item];
    });
  } else {
    params.patientId = route.params.patientId || patientData.id;
  }
  const pageName = (route.meta?.previousPage as string) || "TreatmentList";
  router.push({
    name: pageName,
    params,
  });
};

onMounted(() => {
  const patientId = parseInt(route.params.patientId as any);
  formData.patient_id = patientId as any;
  formData.user_id = authStore.id as any;
  if (route.params.id) {
    loadingGetTreatment.value = true;
    getTreatmentById(parseInt(route.params.id as any))
      .then((response) => {
        if (!response) return;
        formData.objective = response.objective;
        if (response.blood_pressure) {
          formData.blood_pressure = response.blood_pressure;
          const splitValue = response.blood_pressure.split("/");
          bloodPressureData.value = splitValue;
        }
        formData.pulse_frequency = response.pulse_frequency || "";
        formData.is_pregnant =
          typeof response.is_pregnant === "boolean"
            ? response.is_pregnant
            : false;
        formData.duration_advice_id = response.duration_advice_id as any;
        formData.patient_id = response.patient_id as any;
        formData.treatment_packet_id = response.treatment_packet_id as any;
        formData.evaluation = response.evaluation || "";
        formData.doctor_diagnosis = response.doctor_diagnosis
          ? (response.doctor_diagnosis.map((item) => item.id) as any)
          : [];
        formData.medicine = response.medicine
          ? (response.medicine.map((item) => item.id) as any)
          : [];
        formData.therapy_history = response.therapy_history
          ? (response.therapy_history.map((item) => item.id) as any)
          : [];
        formData.complaint = response.complaint
          ? (response.complaint.map((item) => item.id) as any)
          : [];
        formData.stomach_checkup = response.stomach_checkup
          ? (response.stomach_checkup.map((item) => item.id) as any)
          : [];
        formData.tongue_checkup = response.tongue_checkup
          ? (response.tongue_checkup.map((item) => item.id) as any)
          : [];
        formData.self_therapy = response.self_therapy
          ? (response.self_therapy.map((item) => item.id) as any)
          : [];
        formData.therapy = response.therapy
          ? (response.therapy.map((item) => item.id) as any)
          : [];
        formData.pulse_checkup.depth = response.pulse_checkup
          ? response.pulse_checkup.depth
          : "";
        formData.pulse_checkup.speed = response.pulse_checkup
          ? response.pulse_checkup.speed
          : "";
        formData.pulse_checkup.power = response.pulse_checkup
          ? response.pulse_checkup.power
          : "";
        formData.pulse_checkup.abnormal_type = response.pulse_checkup
          ? response.pulse_checkup.abnormal_type
          : "";
        formData.pulse_checkup.location_differentiation = response.pulse_checkup
          ? response.pulse_checkup.location_differentiation
          : "";
        formData.clinic_id = response.clinic_id as any;
        isHomecareTreatment.value = response.clinic_id ? false : true;
        if (response.pulse_checkup) {
          const diffLoc =
            response.pulse_checkup.location_differentiation.split(";");
          pulseLocationDifferentiation.value.cun_left = diffLoc[0];
          pulseLocationDifferentiation.value.guan_left = diffLoc[1];
          pulseLocationDifferentiation.value.chi_left = diffLoc[2];
          pulseLocationDifferentiation.value.cun_right = diffLoc[3];
          pulseLocationDifferentiation.value.guan_right = diffLoc[4];
          pulseLocationDifferentiation.value.chi_right = diffLoc[5];
        }
        selectedTreatmentPacket.value = response.treatment_packet as any;
        selectedDoctorDiagnosis.value = response.doctor_diagnosis as any;
        selectedMedicine.value = response.medicine as any;
        selectedTherapyHistory.value = response.therapy_history as any;
        selectedComplaint.value = response.complaint as any;
        selectedStomachCheckup.value = response.stomach_checkup as any;
        selectedTongueCheckup.value = response.tongue_checkup as any;
        selectedSelfTherapy.value = response.self_therapy as any;
        selectedDurationAdvice.value = response.duration_advice as any;
        selectedTherapy.value = response.therapy.map((item) => ({
          id: item.id,
          name: item.name,
          detail: item.TreatmentTherapy.detail,
        })) as any;
        patientData.id = response.patient.id;
        patientData.no_rm = response.patient.no_rm;
        patientData.name = response.patient.name;
        patientData.gender = response.patient.gender;
      })
      .finally(() => {
        loadingGetTreatment.value = false;
      });
  } else {
    loadingGetTreatment.value = true;
    getPatientById(patientId)
      .then((response) => {
        if (!response) return;
        patientData.no_rm = response.no_rm;
        patientData.name = response.name;
        patientData.gender = response.gender;
      })
      .finally(() => {
        loadingGetTreatment.value = false;
      });
  }
});

onBeforeUnmount(() => {
  editedFormKey.clear();
});
</script>

<template>
  <div
    class="w-full max-w-3xl p-6 mx-auto mb-24 bg-white shadow-lg mt-14 rounded-xl"
  >
    <h1 class="mb-3 text-4xl font-medium text-center">
      {{ route.meta.title }}
    </h1>
    <div class="flex items-center justify-center mb-3">
      <GrayButton @click="toPreviousPage" class="text-sm">Kembali</GrayButton>
    </div>
    <div class="divide-y-2 divide-gray-400">
      <div class="py-8 space-y-5">
        <div>
          <p class="font-medium text-gray-700">No RM</p>
          <p>{{ patientData.no_rm }}</p>
        </div>
        <div>
          <p class="font-medium text-gray-700">Nama Pasien</p>
          <p>{{ patientData.name }}</p>
        </div>
      </div>
      <div class="py-8 space-y-5">
        <!-- Tujuan Perawatan -->
        <RadioGroup
          v-model="formData.objective"
          :disabled="readOnly"
          @update:model-value="onEditDataChange('objective')"
        >
          <RadioGroupLabel class="font-medium"
            >Tujuan Perawatan</RadioGroupLabel
          >
          <div
            class="flex flex-col items-center justify-center gap-5 mt-3 md:flex-row"
          >
            <RadioGroupOption
              v-for="(obj, i) in treatmentObjective"
              :key="'treatment-objective-' + i"
              as="template"
              :value="obj"
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
                class="relative w-full px-5 py-3 text-center rounded-lg cursor-pointer focus:outline-none"
              >
                <RadioGroupLabel>{{ obj }}</RadioGroupLabel>
              </div>
            </RadioGroupOption>
          </div>
        </RadioGroup>
        <!-- Jenis Perawatan -->
        <RadioGroup
          v-if="route.name === 'TreatmentAdd'"
          v-model="isHomecareTreatment"
          :disabled="readOnly"
          @update:model-value="onEditDataChange('clinic_id')"
        >
          <RadioGroupLabel class="font-medium">Jenis Perawatan</RadioGroupLabel>
          <div class="flex items-center gap-3 mt-3 md:gap-5">
            <RadioGroupOption
              as="template"
              :value="false"
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
              :value="true"
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
        <SingleClinicSelect
          v-else
          label="Klinik"
          v-model="selectedClinic"
          :disabled="readOnly"
          @update:model-value="onSelectClinic"
        />
        <!-- Paket Perawatan -->
        <SingleTreatmentPacketSelect
          label="Paket Perawatan"
          v-model="selectedTreatmentPacket"
          :disabled="readOnly"
          @update:model-value="onSelectTreatmentPacket"
        />
      </div>
      <div class="py-8">
        <p class="mb-3 text-lg font-medium">Pemeriksaan</p>
        <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <!-- Tekanan Darah -->
          <div class="flex items-center gap-1">
            <TextInput
              v-model="bloodPressureData[0]"
              type="number"
              label="Tekanan Darah"
              :disabled="readOnly"
              @update:model-value="onBloodPressureInput"
            ></TextInput>
            <p class="font-bold text-gray-300">/</p>
            <TextInput
              v-model="bloodPressureData[1]"
              type="number"
              label="Tekanan Darah"
              :disabled="readOnly"
              @update:model-value="onBloodPressureInput"
            ></TextInput>
          </div>
          <!-- Frekuensi Nadi -->
          <TextInput
            v-model="formData.pulse_frequency"
            type="number"
            label="Frekuensi Nadi"
            :disabled="readOnly"
          ></TextInput>
        </div>
      </div>
      <div class="py-8 space-y-5">
        <!-- Status Kehamilan -->
        <RadioGroup
          v-if="patientData.gender === 'P'"
          v-model="formData.is_pregnant"
          :disabled="readOnly"
          @update:model-value="onEditDataChange('is_pregnant')"
        >
          <RadioGroupLabel class="font-medium"
            >Status Kehamilan</RadioGroupLabel
          >
          <div class="flex items-center gap-3 mt-3 md:gap-5">
            <RadioGroupOption
              as="template"
              :value="false"
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
                <RadioGroupLabel>Tidak Hamil</RadioGroupLabel>
              </div>
            </RadioGroupOption>
            <RadioGroupOption
              as="template"
              :value="true"
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
                <RadioGroupLabel>Hamil</RadioGroupLabel>
              </div>
            </RadioGroupOption>
          </div>
        </RadioGroup>
        <!-- Diagnosa Dokter -->
        <MultiDoctorDiagnosisSelect
          label="Diagnosa Dokter"
          v-model="selectedDoctorDiagnosis"
          :disabled="readOnly"
          @update:model-value="onSelectDoctorDiagnosis"
        />
        <!-- Riwayat Minum Obat -->
        <MultiMedicineSelect
          label="Riwayat Minum Obat"
          v-model="selectedMedicine"
          :disabled="readOnly"
          @update:model-value="onSelectMedicine"
        />
        <!-- Riwayat Diterapi -->
        <MultiTherapyHistorySelect
          label="Riwayat diterapi"
          v-model="selectedTherapyHistory"
          :disabled="readOnly"
          @update:model-value="onSelectTherapyHistory"
        />
        <!-- Keluhan -->
        <MultiComplaintSelect
          label="Keluhan"
          v-model="selectedComplaint"
          :disabled="readOnly"
          @update:model-value="onSelectComplaint"
        />
      </div>
      <div class="py-8 space-y-5">
        <!-- Pemeriksaan Perut -->
        <MultiStomachCheckupSelect
          label="Pemeriksaan Perut"
          v-model="selectedStomachCheckup"
          :disabled="readOnly"
          @update:model-value="onSelectStomachCheckup"
        />
        <!-- Pemeriksaan Lidah -->
        <MultiTongueCheckupSelect
          label="Pemeriksaan Lidah"
          v-model="selectedTongueCheckup"
          :disabled="readOnly"
          @update:model-value="onSelectTongueCheckup"
        />
        <!-- Pemeriksaan Nadi -->
        <div class="space-y-5">
          <p class="text-lg font-medium">Pemeriksaan Nadi</p>
          <!-- Kedalaman nadi -->
          <RadioGroup
            v-model="formData.pulse_checkup.depth"
            :disabled="readOnly"
            @update:model-value="onEditDataChange('pulse_checkup')"
          >
            <RadioGroupLabel class="font-medium">Kedalaman</RadioGroupLabel>
            <div
              class="flex flex-col items-center gap-3 mt-3 md:gap-5 md:flex-row"
            >
              <RadioGroupOption
                v-for="(depth, i) in pulseCheckupDepth"
                :key="'pulse-checkup-depth-' + i"
                as="template"
                :value="depth"
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
                  <RadioGroupLabel>{{ depth }}</RadioGroupLabel>
                </div>
              </RadioGroupOption>
            </div>
          </RadioGroup>
          <!-- Kecepatan nadi -->
          <RadioGroup
            v-model="formData.pulse_checkup.speed"
            :disabled="readOnly"
            @update:model-value="onEditDataChange('pulse_checkup')"
          >
            <RadioGroupLabel class="font-medium">Kecepatan</RadioGroupLabel>
            <div
              class="flex flex-col items-center gap-3 mt-3 md:gap-5 md:flex-row"
            >
              <RadioGroupOption
                v-for="(speed, i) in pulseCheckupSpeed"
                :key="'pulse-checkup-speed-' + i"
                as="template"
                :value="speed"
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
                  <RadioGroupLabel>{{ speed }}</RadioGroupLabel>
                </div>
              </RadioGroupOption>
            </div>
          </RadioGroup>
          <!-- Kekuatan nadi -->
          <RadioGroup
            v-model="formData.pulse_checkup.power"
            :disabled="readOnly"
            @update:model-value="onEditDataChange('pulse_checkup')"
          >
            <RadioGroupLabel class="font-medium">Kekuatan</RadioGroupLabel>
            <div
              class="flex flex-col items-center gap-3 mt-3 md:gap-5 md:flex-row"
            >
              <RadioGroupOption
                v-for="(power, i) in pulseCheckupPower"
                :key="'pulse-checkup-power-' + i"
                as="template"
                :value="power"
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
                  <RadioGroupLabel>{{ power }}</RadioGroupLabel>
                </div>
              </RadioGroupOption>
            </div>
          </RadioGroup>
          <!-- Jenis Nadi Abnormal -->
          <RadioGroup
            v-model="formData.pulse_checkup.abnormal_type"
            :disabled="readOnly"
            @update:model-value="onEditDataChange('pulse_checkup')"
          >
            <RadioGroupLabel class="font-medium"
              >Jenis Nadi Abnormal</RadioGroupLabel
            >
            <div
              class="grid grid-cols-1 gap-3 mt-3 md:grid-cols-2 lg:grid-cols-3 md:gap-5"
            >
              <RadioGroupOption
                v-for="(abnormal, i) in pulseCheckupAbnormalType"
                :key="'pulse-checkup-abnormal-' + i"
                as="template"
                :value="abnormal"
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
                  <RadioGroupLabel>{{ abnormal }}</RadioGroupLabel>
                </div>
              </RadioGroupOption>
            </div>
          </RadioGroup>
          <!-- Diferensiasi Lokasi Nadi -->
          <div>
            <p class="mb-3 text-lg font-medium">Diferensiasi Lokasi</p>
            <div class="grid grid-cols-1 devide-y lg:divide-x lg:grid-cols-2">
              <div class="pb-3 pr-0 space-y-3 lg:pr-3 lg:pb-0">
                <!-- Cun kiri -->
                <RadioGroup
                  v-model="pulseLocationDifferentiation.cun_left"
                  :disabled="readOnly"
                  @update:model-value="onPulseLocDiffInput"
                >
                  <RadioGroupLabel class="font-medium"
                    >Cun (kiri)</RadioGroupLabel
                  >
                  <div class="flex items-center gap-2 mt-3">
                    <RadioGroupOption
                      v-for="(dl, i) in pulseCheckupDiffLoc"
                      :key="'pulse-checkup-dl-cl-' + i"
                      as="template"
                      :value="dl"
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
                        class="relative flex items-center justify-center w-full p-2 rounded-lg cursor-pointer focus:outline-none"
                      >
                        <RadioGroupLabel>{{ dl }}</RadioGroupLabel>
                      </div>
                    </RadioGroupOption>
                  </div>
                </RadioGroup>
                <!-- Guan kiri -->
                <RadioGroup
                  v-model="pulseLocationDifferentiation.guan_left"
                  :disabled="readOnly"
                  @update:model-value="onPulseLocDiffInput"
                >
                  <RadioGroupLabel class="font-medium"
                    >Guan (kiri)</RadioGroupLabel
                  >
                  <div class="flex items-center gap-2 mt-3">
                    <RadioGroupOption
                      v-for="(dl, i) in pulseCheckupDiffLoc"
                      :key="'pulse-checkup-dl-gl-' + i"
                      as="template"
                      :value="dl"
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
                        class="relative flex items-center justify-center w-full p-2 rounded-lg cursor-pointer focus:outline-none"
                      >
                        <RadioGroupLabel>{{ dl }}</RadioGroupLabel>
                      </div>
                    </RadioGroupOption>
                  </div>
                </RadioGroup>
                <!-- Chi Kiri -->
                <RadioGroup
                  v-model="pulseLocationDifferentiation.chi_left"
                  :disabled="readOnly"
                  @update:model-value="onPulseLocDiffInput"
                >
                  <RadioGroupLabel class="font-medium"
                    >Chi (kiri)</RadioGroupLabel
                  >
                  <div class="flex items-center gap-2 mt-3">
                    <RadioGroupOption
                      v-for="(dl, i) in pulseCheckupDiffLoc"
                      :key="'pulse-checkup-dl-chl-' + i"
                      as="template"
                      :value="dl"
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
                        class="relative flex items-center justify-center w-full p-2 rounded-lg cursor-pointer focus:outline-none"
                      >
                        <RadioGroupLabel>{{ dl }}</RadioGroupLabel>
                      </div>
                    </RadioGroupOption>
                  </div>
                </RadioGroup>
              </div>
              <div class="pt-3 pl-0 space-y-3 lg:pl-3 lg:pt-0">
                <!-- Cun Kanan -->
                <RadioGroup
                  v-model="pulseLocationDifferentiation.cun_right"
                  :disabled="readOnly"
                  @update:model-value="onPulseLocDiffInput"
                >
                  <RadioGroupLabel class="font-medium"
                    >Cun (kanan)</RadioGroupLabel
                  >
                  <div class="flex items-center gap-2 mt-3">
                    <RadioGroupOption
                      v-for="(dl, i) in pulseCheckupDiffLoc"
                      :key="'pulse-checkup-dl-cl-' + i"
                      as="template"
                      :value="dl"
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
                        class="relative flex items-center justify-center w-full p-2 rounded-lg cursor-pointer focus:outline-none"
                      >
                        <RadioGroupLabel>{{ dl }}</RadioGroupLabel>
                      </div>
                    </RadioGroupOption>
                  </div>
                </RadioGroup>
                <!-- Guan Kanan -->
                <RadioGroup
                  v-model="pulseLocationDifferentiation.guan_right"
                  :disabled="readOnly"
                  @update:model-value="onPulseLocDiffInput"
                >
                  <RadioGroupLabel class="font-medium"
                    >Guan (kanan)</RadioGroupLabel
                  >
                  <div class="flex items-center gap-2 mt-3">
                    <RadioGroupOption
                      v-for="(dl, i) in pulseCheckupDiffLoc"
                      :key="'pulse-checkup-dl-gl-' + i"
                      as="template"
                      :value="dl"
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
                        class="relative flex items-center justify-center w-full p-2 rounded-lg cursor-pointer focus:outline-none"
                      >
                        <RadioGroupLabel>{{ dl }}</RadioGroupLabel>
                      </div>
                    </RadioGroupOption>
                  </div>
                </RadioGroup>
                <!-- Chi Kanan -->
                <RadioGroup
                  v-model="pulseLocationDifferentiation.chi_right"
                  :disabled="readOnly"
                  @update:model-value="onPulseLocDiffInput"
                >
                  <RadioGroupLabel class="font-medium"
                    >Chi (kanan)</RadioGroupLabel
                  >
                  <div class="flex items-center gap-2 mt-3">
                    <RadioGroupOption
                      v-for="(dl, i) in pulseCheckupDiffLoc"
                      :key="'pulse-checkup-dl-chl-' + i"
                      as="template"
                      :value="dl"
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
                        class="relative flex items-center justify-center w-full p-2 rounded-lg cursor-pointer focus:outline-none"
                      >
                        <RadioGroupLabel>{{ dl }}</RadioGroupLabel>
                      </div>
                    </RadioGroupOption>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="py-8">
        <!-- Terapi / Tindakan -->
        <MultiTherapySelect
          label="Terapi (Tindakan)"
          v-model="selectedTherapy"
          :disabled="readOnly"
          @update:model-value="onSelectTherapy"
        />
      </div>
      <div class="py-8 space-y-5">
        <!-- Saran Terapi Mandiri -->
        <MultiSelfTherapySelect
          label="Saran Terapi Mandiri"
          v-model="selectedSelfTherapy"
          :disabled="readOnly"
          @update:model-value="onSelectSelfTherapy"
        />
        <!-- Saran Perawatan -->
        <SingleDurationAdviceSelect
          label="Saran Perawatan"
          v-model="selectedDurationAdvice"
          :disabled="readOnly"
          @update:model-value="onSelectDurationAdvice"
        />
      </div>
      <div class="py-8">
        <!-- Evaluasi -->
        <TextArea
          v-model="formData.evaluation"
          label="Evaluasi"
          :disabled="readOnly"
          @update:model-value="onEditDataChange('evaluation')"
        ></TextArea>
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

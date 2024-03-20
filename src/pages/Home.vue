<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import { tokenKey } from "../configs";
import { getUserById } from "../services/user.service";
import { getPatientCount } from "../services/patient.service";
import { getStartEndOfMonthDate } from "../utils/date.util";

const router = useRouter();
const authStore = useAuthStore();

const userData = ref({
  name: "",
  clinic: "",
});
const patientCount = ref({
  clinic_today: 0,
  clinic_month: 0,
  therapist_today: 0,
  therapist_month: 0,
});

const onLogout = () => {
  authStore.resetState();
  localStorage.removeItem(tokenKey);
  router.push({ name: "Login" });
};

onMounted(() => {
  getUserById(authStore.id).then((response) => {
    if (!response) return;
    userData.value.name = response.name;
    userData.value.clinic = response.clinic
      ? response.clinic.name
      : "Marisembuh";
  });
  const todayDateStr = new Date().toISOString();
  const { startOfMonth, endOfMonth } = getStartEndOfMonthDate();
  const startOfMonthStr = startOfMonth.toISOString();
  const endOfMonthStr = endOfMonth.toISOString();
  // pasien hari ini di klinik (filter clinic_id)
  getPatientCount({
    clinic_id: authStore.clinic_id,
    start_date: todayDateStr,
    end_date: todayDateStr,
  }).then((response) => {
    if (!response) return;
    patientCount.value.clinic_today = response;
  });
  // pasien bulan ini di klinik (filter clinic_id)
  getPatientCount({
    clinic_id: authStore.clinic_id,
    start_date: startOfMonthStr,
    end_date: endOfMonthStr,
  }).then((response) => {
    if (!response) return;
    patientCount.value.clinic_month = response;
  });
  // jumlah terapi hari ini (filter user_id)
  getPatientCount({
    user_id: authStore.id,
    start_date: todayDateStr,
    end_date: todayDateStr,
  }).then((response) => {
    if (!response) return;
    patientCount.value.therapist_today = response;
  });
  // jumlah terapi bulan ini (filter user_id)
  getPatientCount({
    user_id: authStore.id,
    start_date: startOfMonthStr,
    end_date: endOfMonthStr,
  }).then((response) => {
    if (!response) return;
    patientCount.value.therapist_month = response;
  });
});

const routes = ref([
  {
    name: "Fitur",
    list: [
      { type: "route", data: { name: "UserList" }, name: "User" },
      { type: "route", data: { name: "PatientList" }, name: "Pasien" },
      {
        type: "route",
        data: { name: "TreatmentPatientList" },
        name: "Perawatan",
      },
      { type: "route", data: { name: "AbsencePage" }, name: "Absensi" },
    ],
  },
  {
    name: "Analisis",
    list: [
      {
        type: "route",
        data: { name: "TotalPatientAnalytic" },
        name: "Analisis Jumlah Pasien",
      },
      {
        type: "route",
        data: { name: "AbsenceAnalytic" },
        name: "Analisis Absen",
      },
    ],
  },
  {
    name: "Data",
    list: [
      { type: "route", data: { name: "ClinicList" }, name: "Klinik" },
      {
        type: "route",
        data: { name: "TreatmentPacketList" },
        name: "Paket Perawatan",
      },
      {
        type: "route",
        data: { name: "TherapyList" },
        name: "Terapi (Tidakan)",
      },
      { type: "route", data: { name: "MeridianList" }, name: "Meridian" },
      { type: "route", data: { name: "ComplaintList" }, name: "Keluhan" },
      {
        type: "route",
        data: { name: "MedicineList" },
        name: "Riwayat Minum Obat",
      },
      {
        type: "route",
        data: { name: "DoctorDiagnosisList" },
        name: "Diagnosa Dokter",
      },
      {
        type: "route",
        data: { name: "SelfTherapyList" },
        name: "Terapi Mandiri",
      },
      {
        type: "route",
        data: { name: "StomachCheckupList" },
        name: "Pemeriksaan Perut",
      },
      {
        type: "route",
        data: { name: "TongueCheckupList" },
        name: "Pemeriksaan Lidah",
      },
      {
        type: "route",
        data: { name: "DurationAdviceList" },
        name: "Saran Perawatan",
      },
    ],
  },
  {
    name: "Setting",
    list: [{ type: "func", data: onLogout, name: "Logout" }],
  },
]);
</script>

<template>
  <div class="container p-10 mx-auto">
    <div class="space-y-8">
      <div>
        <h2 class="mb-3 text-3xl">
          Halo, <span class="font-medium">{{ userData.name }}</span>
        </h2>
        <h2 class="mb-3 text-xl">
          selamat datang di
          <span class="font-medium">{{ userData.clinic }}</span>
        </h2>
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-4 md:grid-cols-2">
          <div class="w-full px-6 py-2 border border-gray-300 rounded-md">
            <p class="text-sm text-gray-600">Pasien Klinik Hari ini</p>
            <p class="text-3xl font-medium">{{ patientCount.clinic_today }}</p>
          </div>
          <div class="w-full px-6 py-2 border border-gray-300 rounded-md">
            <p class="text-sm text-gray-600">Pasien Klinik Bulan ini</p>
            <p class="text-3xl font-medium">{{ patientCount.clinic_month }}</p>
          </div>
          <div class="w-full px-6 py-2 border border-gray-300 rounded-md">
            <p class="text-sm text-gray-600">Pasien Diterapi Hari ini</p>
            <p class="text-3xl font-medium">
              {{ patientCount.therapist_today }}
            </p>
          </div>
          <div class="w-full px-6 py-2 border border-gray-300 rounded-md">
            <p class="text-sm text-gray-600">Pasien Diterapi Bulan ini</p>
            <p class="text-3xl font-medium">
              {{ patientCount.therapist_month }}
            </p>
          </div>
        </div>
      </div>
      <div v-for="(group, i) in routes" :key="'route-' + i">
        <h2 class="mb-3 text-2xl font-medium">{{ group.name }}</h2>
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-4 md:grid-cols-2">
          <template v-for="list in group.list">
            <RouterLink
              v-if="list.type === 'route'"
              :to="(list.data as any)"
              class="w-full px-6 py-5 text-lg font-medium text-center border border-gray-300 rounded-md hover:bg-blue-500 hover:text-white"
            >
              {{ list.name }}
            </RouterLink>
            <button
              v-else
              @click="list.data"
              class="w-full px-6 py-5 text-lg font-medium text-center border border-gray-300 rounded-md hover:bg-blue-500 hover:text-white"
            >
              Logout
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

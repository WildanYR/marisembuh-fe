<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import { tokenKey } from "../configs";
import { getUserById } from "../services/user.service";
import { getPatientCount } from "../services/patient.service";

const router = useRouter();
const authStore = useAuthStore();

const routes = ref([
  {
    name: "Fitur",
    routes: [
      { to: "UserList", name: "User" },
      { to: "PatientList", name: "Pasien" },
      { to: "TreatmentPatientList", name: "Perawatan" },
      { to: "StatisticPage", name: "Statistik" },
      { to: "AbsencePage", name: "Absensi" },
    ],
  },
  {
    name: "Data",
    routes: [
      { to: "ClinicList", name: "Klinik" },
      { to: "TreatmentPacketList", name: "Paket Perawatan" },
      { to: "TherapyList", name: "Terapi (Tidakan)" },
      { to: "MeridianList", name: "Meridian" },
      { to: "ComplaintList", name: "Keluhan" },
      { to: "MedicineList", name: "Riwayat Minum Obat" },
      { to: "DoctorDiagnosisList", name: "Diagnosa Dokter" },
      { to: "SelfTherapyList", name: "Terapi Mandiri" },
      { to: "StomachCheckupList", name: "Pemeriksaan Perut" },
      { to: "TongueCheckupList", name: "Pemeriksaan Lidah" },
      { to: "DurationAdviceList", name: "Saran Perawatan" },
    ],
  },
]);
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
  const todayDateString = new Date().toISOString();
  const monthDate = new Date();
  monthDate.setDate(1);
  const monthDateString = monthDate.toISOString();
  // pasien hari ini di klinik (filter clinic_id)
  getPatientCount({
    clinic_id: authStore.clinic_id,
    start_date: todayDateString,
  }).then((response) => {
    if (!response) return;
    patientCount.value.clinic_today = response;
  });
  // pasien bulan ini di klinik (filter clinic_id)
  getPatientCount({
    clinic_id: authStore.clinic_id,
    start_date: monthDateString,
    end_date: todayDateString,
  }).then((response) => {
    if (!response) return;
    patientCount.value.clinic_month = response;
  });
  // jumlah terapi hari ini (filter user_id)
  getPatientCount({
    user_id: authStore.id,
    start_date: todayDateString,
  }).then((response) => {
    if (!response) return;
    patientCount.value.therapist_today = response;
  });
  // jumlah terapi bulan ini (filter user_id)
  getPatientCount({
    user_id: authStore.id,
    start_date: monthDateString,
    end_date: todayDateString,
  }).then((response) => {
    if (!response) return;
    patientCount.value.therapist_month = response;
  });
});
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
          <RouterLink
            v-for="(route, i) in group.routes"
            :key="'route-' + i"
            :to="{ name: route.to }"
            class="w-full px-6 py-5 text-lg font-medium text-center border border-gray-300 rounded-md hover:bg-blue-500 hover:text-white"
          >
            {{ route.name }}
          </RouterLink>
        </div>
      </div>
      <div>
        <h2 class="mb-3 text-2xl font-medium">Setting</h2>
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-4 md:grid-cols-2">
          <button
            @click="onLogout"
            class="w-full px-6 py-5 text-lg font-medium text-center border border-gray-300 rounded-md hover:bg-blue-500 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

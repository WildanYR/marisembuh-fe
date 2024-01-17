<script setup lang="ts">
import { ref } from "vue";

const routes = ref([
  {
    name: "Fitur",
    routes: [
      { to: "UserList", name: "User" },
      { to: "PatientList", name: "Pasien" },
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
</script>

<template>
  <div class="container p-10 mx-auto">
    <div class="space-y-8">
      <div v-for="(group, i) in routes" :key="'route-' + i">
        <h2 class="mb-3 text-2xl font-medium">{{ group.name }}</h2>
        <div class="grid grid-cols-4 gap-5 justify-stretch">
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
    </div>
  </div>
</template>

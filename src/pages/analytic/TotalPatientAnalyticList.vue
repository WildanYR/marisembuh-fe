<script setup lang="ts">
import GrayButton from "../../components/button/GrayButton.vue";
import ChevLeftIcon from "../../components/icon/ChevLeftIcon.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const routes = [
  { data: { name: "TotalPatientAnalyticClinic" }, name: "Klinik" },
  { data: { name: "TotalPatientAnalyticUser" }, name: "Terapis" },
  { data: { name: "TotalPatientAnalyticTherapy" }, name: "Jenis Terapi" },
];

const toPreviousPage = () => {
  router.push({ name: "Home" });
};
</script>

<template>
  <div class="p-8 bg-white rounded-lg">
    <div
      class="flex flex-col items-start justify-start gap-4 lg:items-center lg:flex-row lg:justify-between"
    >
      <div class="flex gap-3">
        <GrayButton
          @click="toPreviousPage"
          class="flex items-center justify-center !px-3"
        >
          <ChevLeftIcon class="w-5 h-5" />
        </GrayButton>
        <h1 class="text-2xl font-medium">Analisis Jumlah Pasien</h1>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-5 mt-5 lg:grid-cols-3">
      <template v-for="route in routes">
        <RouterLink
          :to="(route.data as any)"
          class="w-full px-6 py-5 text-lg font-medium text-center border border-gray-300 rounded-md hover:bg-blue-500 hover:text-white"
        >
          {{ route.name }}
        </RouterLink>
      </template>
    </div>
  </div>
</template>

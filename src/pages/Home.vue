<script setup lang="ts"></script>

<template>
  <div class="flex flex-col">
    <RouterLink :to="{ name: 'PatientList' }">Pasien</RouterLink>
    <RouterLink :to="{ name: 'ClinicList' }">Klinik</RouterLink>
    <RouterLink :to="{ name: 'MedicineList' }">Obat</RouterLink>
    <RouterLink :to="{ name: 'DoctorDiagnosisList' }">
      Diagnosa Dokter
    </RouterLink>
    <RouterLink :to="{ name: 'SelfTherapyList' }"> Terapi Mandiri </RouterLink>
    <RouterLink :to="{ name: 'TreatmentPacketList' }"
      >Paket Perawatan
    </RouterLink>
    <RouterLink :to="{ name: 'StomachCheckupList' }"
      >Pemeriksaan Perut
    </RouterLink>
  </div>
</template>

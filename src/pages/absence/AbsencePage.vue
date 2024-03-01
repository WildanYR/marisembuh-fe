<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { QrcodeStream } from "vue-qrcode-reader";
import { AbsenceStatus } from "./types/absence_status.type";
import { AbsenceType } from "./types/absence_type.type";
import {
  checkAbsence,
  finishAbsence,
  handleAbsence,
} from "../../services/absence.service";
import { useAuthStore } from "../../stores/auth.store";
import TextInput from "../../components/form/TextInput.vue";
import LoadingButton from "../../components/LoadingButton.vue";
import GrayButton from "../../components/button/GrayButton.vue";

const router = useRouter();
const authStore = useAuthStore();

const absenceStatus = reactive({
  status: "",
  absenceCode: "",
});

const QrCode = ref("");
const absenceCode = ref("");

const loadingAbsence = ref(false);
const loadingFinishAbsence = ref(false);

const absenceTitle = computed(() => {
  if (absenceStatus.status === AbsenceStatus.HOMECARE)
    return "Scan QrCode jika sudah sampai klinik";
  if (absenceStatus.status === AbsenceStatus.HAS_ABSENT)
    return "Absen Berhasil";
  if (absenceStatus.status === AbsenceStatus.AFTERWORK)
    return "Terimakasih atas kerja kerasnya";
  return "Silahkan Scan QR Code di klinik";
});

const onQrDetected = (codes: any[]) => {
  QrCode.value = codes[0].rawValue;
  onHandleAbsence(AbsenceType.QRCODE);
};

const onQrScannerError = (error: Error) => {
  console.log(error);
};

const onHandleAbsence = (type: AbsenceType) => {
  let data;
  if (type === AbsenceType.QRCODE) {
    data = QrCode.value;
  }
  if (type === AbsenceType.CODE) {
    data = absenceCode.value;
  }
  handleAbsence(authStore.id, type, data).then((response) => {
    absenceStatus.status = response.status;
    absenceStatus.absenceCode = response.absence_code
      ? response.absence_code
      : "";
  });
};

const onHandleFinishAbsence = () => {
  finishAbsence(authStore.id).then((response) => {
    absenceStatus.status = response.status;
    absenceStatus.absenceCode = "";
  });
};

const toPreviousPage = () => {
  router.push({ name: "Home" });
};

onBeforeMount(() => {
  checkAbsence(authStore.id).then((response) => {
    absenceStatus.status = response.status;
    absenceStatus.absenceCode = response.absence_code
      ? response.absence_code
      : "";
  });
});
</script>

<template>
  <div
    class="w-full max-w-xl p-6 mx-auto mb-24 bg-white shadow-lg mt-14 rounded-xl"
  >
    <h1 class="mb-3 text-4xl font-medium text-center">Absensi</h1>
    <div class="flex items-center justify-center mb-3">
      <GrayButton @click="toPreviousPage" class="text-sm">Kembali</GrayButton>
    </div>
    <div class="space-y-8">
      <p class="font-medium text-center">{{ absenceTitle }}</p>
      <template v-if="absenceStatus.status === AbsenceStatus.HAS_ABSENT">
        <div class="flex flex-col items-center justify-center gap-2">
          <p class="text-sm text-center">Kode Absen untuk user lain</p>
          <p
            class="px-3 py-2 text-2xl font-bold tracking-widest bg-blue-200 rounded-md w-min"
          >
            {{ absenceStatus.absenceCode }}
          </p>
        </div>
        <LoadingButton
          :loading="loadingFinishAbsence"
          @click="onHandleFinishAbsence"
          class="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-blue-200 disabled:text-blue-600"
        >
          Selesai Kerja
        </LoadingButton>
      </template>
      <template
        v-if="
          absenceStatus.status === AbsenceStatus.NO_ABSENCE ||
          absenceStatus.status === AbsenceStatus.HOMECARE
        "
      >
        <QrcodeStream
          @detect="onQrDetected"
          @error="onQrScannerError"
        ></QrcodeStream>
      </template>
      <template v-if="absenceStatus.status === AbsenceStatus.NO_ABSENCE">
        <div class="inline-flex items-center justify-center w-full">
          <hr class="w-full h-px bg-gray-500 border-0" />
          <span
            class="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2"
            >Metode Lain</span
          >
        </div>
        <LoadingButton
          :loading="loadingAbsence"
          @click="onHandleAbsence(AbsenceType.HOMECARE)"
          class="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-blue-200 disabled:text-blue-600"
        >
          Absen Homecare
        </LoadingButton>
        <hr class="h-px bg-gray-500 border-0" />
        <div class="space-y-2">
          <TextInput v-model="absenceCode" label="Kode Absen"></TextInput>
          <LoadingButton
            :loading="loadingAbsence"
            @click="onHandleAbsence(AbsenceType.CODE)"
            class="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-blue-200 disabled:text-blue-600"
          >
            Absen dengan kode
          </LoadingButton>
        </div>
      </template>
      <GrayButton @click="toPreviousPage" class="w-full">Kembali</GrayButton>
    </div>
  </div>
</template>

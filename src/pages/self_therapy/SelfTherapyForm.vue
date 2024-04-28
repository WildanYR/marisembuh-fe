<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Validator } from "../../validator";
import isRequired from "../../validator/isRequired.validator";
import {
  createSelfTherapy,
  getSelfTherapyById,
  updateSelfTherapy,
} from "../../services/self_therapy.service";
import TextInput from "../../components/form/TextInput.vue";
import LoadingButton from "../../components/LoadingButton.vue";
import GrayButton from "../../components/button/GrayButton.vue";

const router = useRouter();
const route = useRoute();

const formData = reactive({
  name: "",
});
const formDataError = reactive({
  name: [],
});
const loadingGetSelfTherapy = ref(false);
const loadingSubmit = ref(false);

const readOnly = computed(() => {
  if (route.meta.readOnly) return true;
  return false;
});

const handleAddSelfTherapy = () => {
  const validator = new Validator();
  validator.addValidation("name", formData.name, [isRequired]);
  if (validator.validate()) {
    formDataError.name = validator.getError("name") as any;
    return;
  }
  loadingSubmit.value = true;
  createSelfTherapy({ ...formData })
    .then(() => {
      toPreviousPage();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleEditSelfTherapy = () => {
  const validator = new Validator();
  validator.addValidation("name", formData.name, [isRequired]);
  if (validator.validate()) {
    formDataError.name = validator.getError("name") as any;
    return;
  }
  loadingSubmit.value = true;
  updateSelfTherapy(parseInt(route.params.id as any), { ...formData })
    .then(() => {
      toPreviousPage();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleSubmit = () => {
  if (route.name === "SelfTherapyAdd") {
    handleAddSelfTherapy();
  } else {
    handleEditSelfTherapy();
  }
};

const toPreviousPage = () => {
  if (route.query.ref) {
    const ref = JSON.parse(decodeURIComponent(route.query.ref as string));
    router.push(ref);
  } else {
    router.push({ name: "SelfTherapyList" });
  }
};

onMounted(() => {
  if (route.params.id) {
    loadingGetSelfTherapy.value = true;
    getSelfTherapyById(parseInt(route.params.id as any))
      .then((response) => {
        if (!response) return;
        formData.name = response.name;
      })
      .finally(() => {
        loadingGetSelfTherapy.value = false;
      });
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
      <TextInput
        v-model="formData.name"
        label="Nama Terapi Mandiri"
        :disabled="readOnly"
        :error-message="formDataError.name"
      ></TextInput>
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

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Validator } from "../../validator";
import isRequired from "../../validator/isRequired.validator";
import {
  createUser,
  getUserById,
  updateUser,
} from "../../services/user.service";
import TextInput from "../../components/form/TextInput.vue";
import LoadingButton from "../../components/LoadingButton.vue";
import { RadioGroup, RadioGroupOption, RadioGroupLabel } from "@headlessui/vue";
import GrayButton from "../../components/button/GrayButton.vue";

const router = useRouter();
const route = useRoute();

const userRoles = ref([
  { id: "ADMIN", name: "Admin" },
  { id: "TERAPIS", name: "Terapis" },
]);

const formData = reactive({
  email: "",
  password: "",
  name: "",
  role: "",
});
const formDataError = reactive({
  email: [],
  password: [],
  name: [],
  role: [],
});
const loadingGetUser = ref(false);
const loadingSubmit = ref(false);

const readOnly = computed(() => {
  if (route.meta.readOnly) return true;
  return false;
});

const handleAddUser = () => {
  const validator = new Validator();
  validator.addValidation("name", formData.email, [isRequired]);
  if (validator.validate()) {
    formDataError.email = validator.getError("name") as any;
    return;
  }
  loadingSubmit.value = true;
  createUser({ ...formData })
    .then(() => {
      router.back();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleEditUser = () => {
  const validator = new Validator();
  validator.addValidation("name", formData.email, [isRequired]);
  if (validator.validate()) {
    formDataError.email = validator.getError("name") as any;
    return;
  }
  loadingSubmit.value = true;
  updateUser(parseInt(route.params.id as any), { ...formData })
    .then(() => {
      router.back();
    })
    .finally(() => {
      loadingSubmit.value = false;
    });
};

const handleSubmit = () => {
  if (route.name === "UserAdd") {
    handleAddUser();
  } else {
    handleEditUser();
  }
};

const toPreviousPage = () => {
  router.push({ name: "UserList" });
};

onMounted(() => {
  if (route.params.id) {
    loadingGetUser.value = true;
    getUserById(parseInt(route.params.id as any))
      .then((response) => {
        if (!response) return;
        formData.email = response.email;
        formData.name = response.name;
        formData.role = response.role;
      })
      .finally(() => {
        loadingGetUser.value = false;
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
        v-model="formData.email"
        label="Email"
        :disabled="readOnly"
        :error-message="formDataError.email"
      ></TextInput>
      <TextInput
        v-model="formData.password"
        label="Password"
        type="password"
        :disabled="readOnly"
        :error-message="formDataError.password"
      ></TextInput>
      <TextInput
        v-model="formData.name"
        label="Nama"
        :disabled="readOnly"
        :error-message="formDataError.name"
      ></TextInput>
      <RadioGroup v-model="formData.role" :disabled="readOnly">
        <RadioGroupLabel class="text-gray-700">Role</RadioGroupLabel>
        <div class="grid grid-cols-2 gap-3 mt-3">
          <RadioGroupOption
            v-for="(role, i) in userRoles"
            :key="'role-' + i"
            as="template"
            :value="role.id"
            v-slot="{ active, checked }"
          >
            <div
              :class="[
                active
                  ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-blue-300'
                  : '',
                checked
                  ? 'bg-blue-700/75 text-white '
                  : 'bg-white border border-gray-200',
              ]"
              class="relative flex items-center justify-center w-full px-5 py-3 rounded-lg cursor-pointer focus:outline-none"
            >
              <RadioGroupLabel class="text-sm">{{ role.name }}</RadioGroupLabel>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
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

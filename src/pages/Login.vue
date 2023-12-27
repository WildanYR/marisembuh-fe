<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store.ts";
import { Validator } from "../validator/index.ts";
import isRequired from "../validator/isRequired.validator.ts";
import isEmail from "../validator/isEmail.validator.ts";
import min from "../validator/min.validator.ts";
import TextInput from "../components/form/TextInput.vue";
import LoadingButton from "../components/LoadingButton.vue";
import { login } from "../services/auth.service.ts";

const router = useRouter();
const authStore = useAuthStore();

const loadingLogin = ref(false);
const formData = reactive({
  email: "",
  password: "",
});
const formDataError = reactive({
  email: [],
  password: [],
});

const handleLogin = () => {
  const validator = new Validator();
  validator.addValidation("email", formData.email, [isRequired, isEmail]);
  validator.addValidation("password", formData.password, [isRequired, min(4)]);
  const isError = validator.validate();
  if (isError) {
    formDataError.email = validator.getError("email") as any;
    formDataError.password = validator.getError("password") as any;
    return;
  }
  loadingLogin.value = true;
  login({ email: formData.email, password: formData.password })
    .then((response) => {
      if (!response) return;
      authStore.setUserData({
        id: response.id,
        email: response.email,
        name: response.name,
        role: response.role,
      });
      router.push({ name: "Home" });
    })
    .finally(() => {
      loadingLogin.value = false;
    });
};
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100 md:px-0"
  >
    <img
      src="../assets/logo.svg"
      alt="logo marisembuh"
      class="w-64 mt-12 pointer-events-none sm:w-80"
    />
    <div class="w-full max-w-md p-6 mb-24 bg-white shadow-lg mt-14 rounded-xl">
      <h1 class="mb-6 text-4xl font-medium text-center">Login</h1>
      <div class="space-y-4">
        <TextInput
          v-model="formData.email"
          label="Email"
          :error-message="formDataError.email"
        ></TextInput>
        <TextInput
          v-model="formData.password"
          label="Password"
          type="password"
          :error-message="formDataError.password"
        ></TextInput>
        <LoadingButton
          :loading="loadingLogin"
          @click="handleLogin"
          class="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-blue-200 disabled:text-blue-600"
        >
          Login
        </LoadingButton>
      </div>
    </div>
  </div>
</template>

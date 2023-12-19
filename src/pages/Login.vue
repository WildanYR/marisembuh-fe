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
  validator.addValidation("password", formData.password, [isRequired]);
  const isError = validator.validate();
  console.log(isError);
  if (isError) {
    formDataError.email = validator.getError("email");
    formDataError.password = validator.getError("password");
    return;
  }
  loadingLogin.value = true;
  login({ email: formData.email, password: formData.password })
    .then((response) => {
      authStore.setUserData({
        id: response.id,
        email: response.email,
        name: response.name,
        role: response.role,
      });
      router.push({ name: "HelloWorld" });
    })
    .finally(() => {
      loadingLogin.value = false;
    });
};
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 md:px-0"
  >
    <img
      src="../assets/logo.svg"
      alt="logo marisembuh"
      class="pointer-events-none mt-12 w-64 sm:w-80"
    />
    <div class="mb-24 mt-14 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
      <h1 class="mb-6 text-center text-4xl font-medium">Login</h1>
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
          class="w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 transition-colors disabled:bg-blue-200 disabled:text-blue-600 rounded-md"
        >
          Login
        </LoadingButton>
      </div>
    </div>
  </div>
</template>

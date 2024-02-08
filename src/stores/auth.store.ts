import { defineStore } from "pinia";
interface IUserStoreData {
  id: number;
  email: string;
  name: string;
  role: string;
  clinic_id: number;
}
export const useAuthStore = defineStore("auth", {
  state: () => ({
    id: 0,
    email: "",
    name: "",
    role: "",
    clinic_id: 0,
  }),
  actions: {
    setUserData(userData: IUserStoreData) {
      this.id = userData.id;
      this.email = userData.email;
      this.name = userData.name;
      this.role = userData.role;
      this.clinic_id = userData.clinic_id;
    },
    resetState() {
      this.id = 0;
      this.email = "";
      this.name = "";
      this.role = "";
      this.clinic_id = 0;
    },
  },
  persist: true,
});

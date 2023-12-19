import { defineStore } from "pinia";
interface IUserStoreData {
  id: number;
  email: string;
  name: string;
  role: string;
}
export const useAuthStore = defineStore("auth", {
  state: () => ({
    id: 0,
    email: "",
    name: "",
    role: "",
  }),
  actions: {
    setUserData(userData: IUserStoreData) {
      this.id = userData.id;
      this.email = userData.email;
      this.name = userData.name;
      this.role = userData.role;
    },
    resetState() {
      this.id = 0;
      this.email = "";
      this.name = "";
      this.role = "";
    },
  },
  persist: true,
});

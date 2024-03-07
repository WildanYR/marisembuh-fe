import { defineStore } from "pinia";
interface IAbsenceDateFilterStoreData {
  start_date: string;
  end_date: string;
}
export const useAbsenceDateFilterStore = defineStore("absence", {
  state: () => ({
    start_date: "",
    end_date: "",
  }),
  actions: {
    setStoreData(data: IAbsenceDateFilterStoreData) {
      this.start_date = data.start_date;
      this.end_date = data.end_date;
    },
    resetState() {
      this.start_date = "";
      this.end_date = "";
    },
  },
});

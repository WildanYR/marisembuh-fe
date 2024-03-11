import { defineStore } from "pinia";
interface IDateFilterStoreData {
  start_date: string;
  end_date: string;
}
export const useDateFilterStore = defineStore("dateFilter", {
  state: () => ({
    start_date: "",
    end_date: "",
  }),
  actions: {
    setStoreData(data: IDateFilterStoreData) {
      this.start_date = data.start_date;
      this.end_date = data.end_date;
    },
    resetState() {
      this.start_date = "";
      this.end_date = "";
    },
  },
});

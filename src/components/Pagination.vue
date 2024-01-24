<script setup lang="ts">
import { computed } from "vue";
import { createPageList } from "../utils/pagination.util";
import ChevLeftIcon from "./icon/ChevLeftIcon.vue";
import ChevRightIcon from "./icon/ChevRightIcon.vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    default: 10,
  },
});
const emit = defineEmits(["pageChange"]);

const pageList = computed(() => {
  if (!props.currentPage) return [];
  return createPageList(props.currentPage, props.totalPages);
});

const numberItem = computed(() => {
  if (!props.currentPage) return "";
  let max = 0;
  if (props.totalItems < props.limit) {
    max = props.totalItems;
  } else {
    const maxPage = props.limit * props.currentPage;
    if (props.totalItems < maxPage) {
      max = props.totalItems;
    } else {
      max = maxPage;
    }
  }
  const min = props.limit * (props.currentPage - 1) + 1;
  return `${min}-${max}`;
});

const handlePaginate = (page: string | number) => {
  emit("pageChange", typeof page === "string" ? parseInt(page) : page);
};
</script>

<template>
  <nav
    v-if="props.totalItems"
    class="flex flex-col items-center justify-center p-4 space-y-3 lg:justify-between lg:flex-row lg:space-y-0"
    aria-label="Table navigation"
  >
    <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
      Menampilkan
      <span class="font-semibold text-gray-900 dark:text-white">{{
        numberItem
      }}</span>
      dari
      <span class="font-semibold text-gray-900 dark:text-white">{{
        props.totalItems
      }}</span>
    </span>
    <ul class="inline-flex items-stretch -space-x-px">
      <li v-show="props.currentPage != 1">
        <button
          @click="handlePaginate(props.currentPage - 1)"
          class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span class="sr-only">Previous</span>
          <ChevLeftIcon class="w-5 h-5" />
        </button>
      </li>
      <li v-for="(page, i) in pageList" :key="'pagination-' + i">
        <button
          v-if="page !== '...'"
          @click="handlePaginate(page)"
          :class="[
            'flex items-center justify-center px-3 py-2 text-sm leading-tight border dark:border-gray-700',
            page === props.currentPage
              ? 'z-10 text-blue-600 bg-blue-50 border-blue-300 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
          ]"
        >
          {{ page }}
        </button>
        <div
          v-else
          class="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          {{ page }}
        </div>
      </li>
      <li v-show="props.currentPage != props.totalPages">
        <button
          @click="handlePaginate(props.currentPage + 1)"
          class="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span class="sr-only">Next</span>
          <ChevRightIcon class="w-5 h-5" />
        </button>
      </li>
    </ul>
  </nav>
</template>

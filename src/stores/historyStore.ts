// stores/historyStore.js
import { defineStore } from 'pinia';

export const useHistoryStore = defineStore('history', {
  state: () => ({
    items: [],
  }),
  actions: {
    addHistoryItem(item) {
      this.items.push(item);
    },
    removeHistoryItem(id) {
      const index = this.items.findIndex(item => item.id === id);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    }
  }
});

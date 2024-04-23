// stores/selectionStore.js
import { defineStore } from 'pinia';

// 在 Pinia store 中
export const useSelectionStore = defineStore('selection', {
  state: () => ({
    selections: []
  }),
  actions: {
    addSelection(selection) {
      this.selections.push(selection);
      console.log(`Current selections after adding:`, this.selections);
    },
    removeSelection(id) {
      const index = this.selections.findIndex(s => s.id === id);
      if (index !== -1) {
        this.selections.splice(index, 1);
      }
    }
  }
});


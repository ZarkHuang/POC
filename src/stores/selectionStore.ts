// stores/selectionStore.ts
import { defineStore } from 'pinia'

export const useSelectionStore = defineStore('selection', {
  state: () => ({
    selections: [],
    nextLabelIndex: 1,
    nextCustomIndex: 1,
  }),
  actions: {
    addSelection(selection) {
      this.selections.push(selection);
    },
    getNextLabelIndex() {
      return this.nextLabelIndex++;  // 获取当前索引的同时递增
    },
    getNextCustomIndex() {
      return this.nextCustomIndex++;  // 自定义表单索引递增
    },
    removeSelection(id: string) {
      const index = this.selections.findIndex((s) => s.id === id);
      if (index !== -1) {
        this.selections.splice(index, 1);
      }
      if (this.selections.length === 0) {
        this.resetLabelIndex();
      }
    },
    resetLabelIndex() {
      this.nextLabelIndex = 1;
      this.nextCustomIndex = 1;
    },
  },
});

// stores/selectionStore.ts
import { defineStore } from 'pinia'

export const useSelectionStore = defineStore('selection', {
  state: () => ({
    selections: [],
    nextLabelIndex: 1,
  }),
  actions: {
    addSelection(selection) {
      this.selections.push(selection)
      this.nextLabelIndex++ 
    },
    getNextLabelIndex() {
      return this.nextLabelIndex++;
    },
    removeSelection(id: string) {
      const index = this.selections.findIndex((s) => s.id === id)
      if (index !== -1) {
        this.selections.splice(index, 1)
      }
      if (this.selections.length === 0) {
        this.resetLabelIndex()
      }
    },
    resetLabelIndex() {
      this.nextLabelIndex = 1
      console.log(`Reset nextLabelIndex to 1`)
    },
  },
})

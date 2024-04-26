// stores/selectionStore.ts
import { defineStore } from 'pinia'
import { SelectionData } from '@/global'

export const useSelectionStore = defineStore('selection', {
  state: () => ({
    selections: [] as SelectionData[],
    nextLabelIndex: 1,
    nextCustomIndex: 1,
  }),
  actions: {
    addSelection(selection: SelectionData) {
      this.selections.push(selection)
    },
    getNextLabelIndex() {
      return this.nextLabelIndex++
    },
    getNextCustomIndex() {
      return this.nextCustomIndex++
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
      this.nextCustomIndex = 1
    },
  },
})

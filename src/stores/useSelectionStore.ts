import { defineStore } from 'pinia';

export const useImageStore = defineStore('imageStore', {
  state: () => ({
    forms: [],
    imageUploaded: false,
    imageSrc: '',
    selections: [],
    currentSelection: null,
  }),
  actions: {
    addForm(formData) {
      this.forms.push(formData);
    },
    removeForm(formId) {
      const index = this.forms.findIndex(form => form.id === formId);
      if (index !== -1) {
        this.forms.splice(index, 1);
      }
    },
    setImageUploaded(status) {
      this.imageUploaded = status;
    },
    setImageSrc(src) {
      this.imageSrc = src;
    },
    addSelection(selection) {
      this.selections.push(selection);
    },
    setCurrentSelection(selection) {
      this.currentSelection = selection;
    },
    resetCurrentSelection() {
      this.currentSelection = null;
    }
  },
});

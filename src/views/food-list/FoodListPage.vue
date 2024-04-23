<template>
  <NSpace vertical>
    <NGrid cols="2" x-gap="12">
      <NGi :span="1">
        <ImagePreview @close-selection="removeForm"  @selection-saved="addFormWithData"
          @selection-removed="handleSelectionRemoved" />
      </NGi>
      <NGi :span="1">
        <div class="form-header">
          <PageTitle>辨識結果</PageTitle>
          <NButton @click="addForm">新增表單</NButton>
        </div>
        <NScrollbar style="max-height: calc(100vh - 158px);">
          <div v-for="(form, index) in forms" :key="form.id" class="form-content">
            <div class="form-title">Form #{{ index + 1 }}</div>
            <NForm ref="formRef" :model="form.data" inline>
              <NGrid cols="9" x-gap="8" y-gap="8">
                <NGi v-for="item in formItems.slice(0, 9)" :key="`first-${item.path}`">
                  <NFormItem :label="item.label" :path="item.path">
                    <NInput :disabled="!form.editable" v-model:value="form.data[item.path]" />
                  </NFormItem>
                </NGi>
                <NGi v-for="item in formItems.slice(9)" :key="`second-${item.path}`">
                  <NFormItem :label="item.label" :path="item.path">
                    <NInput :disabled="!form.editable" v-model:value="form.data[item.path]" />
                  </NFormItem>
                </NGi>
              </NGrid>
            </NForm>
            <div style="display: flex; justify-content: end;">
              <NButton type="primary" @click="submitForm(form)">提交</NButton>
              <NButton @click="toggleEdit(form)">{{ form.editable ? '確定' : '編輯' }}</NButton>
            </div>
          </div>
        </NScrollbar>
      </NGi>
    </NGrid>
  </NSpace>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { NForm, NFormItem, NInput, NButton, NGrid, NGi, NScrollbar } from 'naive-ui';
import ImagePreview from '@/views/food-list/_components/ImagePreview.vue';

interface FormData {
  [key: string]: string | null;
}

interface FormInstance {
  id: string;
  data: FormData;
  editable: boolean;
}

const forms = reactive<FormInstance[]>([]);
let idCounter = 0;

const formItems = Array.from({ length: 18 }).map((_, i) => ({
  label: `食物 ${i + 1}`,
  path: `name${i + 1}`
}));

function createFormData(): FormData {
  return formItems.reduce((acc, item) => ({
    ...acc,
    [item.path]: ''
  }), {});
}

function addFormWithData(selectionData) {
  console.log('Received selection-saved with ID:', selectionData.id);
  forms.push({
    id: selectionData.id,
    data: createFormData(),
    editable: true
  });
}


function handleSelectionRemoved(data: { id: string; }) {
  console.log('Received selection-removed with ID:', data.id); // 打印 ID
  const index = forms.findIndex(form => form.id === data.id);
  if (index !== -1) {
    console.log('Removing form with index:', index);
    forms.splice(index, 1);
  }
}

function addForm() {
  forms.push({ id: `form-${idCounter++}`, data: createFormData(), editable: true });
}

function submitForm(_form: FormInstance) {
  console.log('提交表單:', forms.map(form => form.data));
  forms.forEach(form => form.editable = false);
}

function toggleEdit(form: FormInstance) {
  form.editable = !form.editable;
}

function removeForm(selectionId) {
  const index = forms.findIndex(form => form.id === selectionId);
  if (index !== -1) {
    forms.splice(index, 1);
  }
}

function removeForm(selectionId) {
  console.log('Attempting to remove form with ID:', selectionId);
  const index = forms.findIndex(form => form.id === selectionId);
  if (index !== -1) {
    console.log('Form found and removing, index:', index);
    forms.splice(index, 1);
  } else {
    console.log('Form with ID not found:', selectionId);
  }
}


</script>

<style scoped>
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-content {
  position: relative;
  top: 24px;
  width: 100%;
  margin-bottom: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #dce4ec;
  padding: 20px;
}
</style>

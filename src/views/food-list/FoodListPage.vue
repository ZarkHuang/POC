<template>
  <NSpace vertical>
    <NGrid cols="3" x-gap="12">
      <NGi :span="2">
        <UploadImage />
      </NGi>
      <NGi :span="1">
        <div class="form-header">
          <PageTitle>辨識結果</PageTitle>
          <NButton @click="addForm">新增表單</NButton>
        </div>
        <NScrollbar style="max-height: calc(100vh - 140px);">
          <div v-for="(form, index) in forms" :key="index" class="form-content">
            <NForm ref="formRef" :model="form.data">
              <NFormItem label="飲食名稱" path="name">
                <NInput v-model:value="form.data.name" />
              </NFormItem>
              <NFormItem label="選項" path="option">
                <NSelect v-model:value="form.data.option" :options="options" placeholder="選擇選項" />
              </NFormItem>
              <NFormItem label="描述" path="message">
                <NInput v-model:value="form.data.message" type="textarea" />
              </NFormItem>
              <NButton type="primary" @click="submitForm" style="width: 100%">提交</NButton>
            </NForm>
          </div>
        </NScrollbar>
      </NGi>
    </NGrid>
  </NSpace>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { NForm, NFormItem, NInput, NButton, NGrid, NGi, NScrollbar, NSelect } from 'naive-ui';
import UploadImage from '@/views/food-list/_components/UploadImagePage.vue';

interface FormData {
  name: string;
  option: string | null;
  message: string;
}

interface FormInstance {
  data: FormData;
}

const forms = reactive<FormInstance[]>([]);
const options = [
  { label: '早餐', value: '早餐' },
  { label: '午餐', value: '午餐' },
  { label: '晚餐', value: '晚餐' },
  { label: '宵夜', value: '宵夜' },
];

function createFormData(): FormData {
  return {
    name: '',
    option: null,
    message: ''
  };
}

function addForm() {
  forms.push({ data: createFormData() });
}

function submitForm() {
  console.log('提交表單:', forms.map(form => form.data));
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
  top:24px;
  width: 100%;
  margin-bottom:12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #dce4ec;
  padding: 20px;
}
</style>

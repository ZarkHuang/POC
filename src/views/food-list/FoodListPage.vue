<template>
  <NSpace vertical>
    <NGrid cols="3" x-gap="12">
      <NGi :span="1">
        <ImagePreview ref="imagePreviewRef" @selection-saved="addFormWithData"
          @selection-removed="handleSelectionRemoved" />
      </NGi>
      <NGi :span="2">
        <div class="form-header">
          <PageTitle>辨識結果</PageTitle>
          <div class="button-group">
            <NButton @click="addForm" style="margin-right:10px">新增表單</NButton>
            <NButton type="primary" @click="toggleDrawer">歷史紀錄</NButton>
          </div>
          <HistoryDrawer v-model="drawerVisible" :historyData="history" @remove="handleRemoveForm" />
        </div>
        <NScrollbar style="max-height: calc(100vh - 158px);">
          <div v-for="form in forms" :key="form.id" class="form-content">
            <NGrid cols="3" justify="end" class="form-title-container" style="margin-bottom:12px; margin-top:-12px">
              <NGi>
                <div class="form-title-container">
                  <div v-if="form.isCustom" class="default-icon-container">
                    <NIcon size="20" :component="NoImage" />
                  </div>
                  <img v-else :src="form.imageUrl" alt="Selected Image" class="form-image-thumbnail">
                  <NH5 class="form-title">{{ form.label || `Image${form.labelIndex}` }}</NH5>
                </div>
              </NGi>
              <NGi :span="2">
                <div style="display: flex; justify-content: flex-end; align-items: center;">
                  <NH5 class="form-title" style="margin: 0px 16px;">名字：王大明</NH5>
                  <NH5 class="form-title" style="margin: 0px 16px;">時間：
                    <NTime :time="Date.now()" type="date" />
                  </NH5>
                  <EditButton type="primary" ghost :form="form" @edit="enableEditing" :isDisabled="isSubmitting" />
                </div>
              </NGi>
            </NGrid>
            <NForm ref="formRef" :model="form.data" inline>
              <NGrid cols="9" x-gap="8" y-gap="8">
                <NGi v-for="item in formItems.slice(0, 9)" :key="`first-${item.path}`">
                  <NFormItem :label="item.label" :path="item.path">
                    <NInput :disabled="!form.editable" v-model:value="form.data[item.path]" />
                  </NFormItem>
                </NGi>
              </NGrid>
            </NForm>
            <div style="display: flex; justify-content: end;">
              <NButton @click="confirmSubmit(form)" :disabled="!form.canSubmit" style='margin-right:10px'>提交</NButton>
              <NButton type="error" @click="confirmRemoveForm(form.id)">删除</NButton>
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
import HistoryDrawer from '@/views/food-list/_components/drawer/HistoryDrawer.vue';
import EditButton from '@/views/food-list/_components/button/EditButton.vue';
import { FormData, FormInstance, HistoryItem } from '@/global'
import { NoImage } from '@vicons/carbon';
const imagePreviewRef = ref(null);
import { useSelectionStore } from '@/stores/selectionStore';


const history: Ref<HistoryItem[]> = ref([]);
const forms = reactive<FormInstance[]>([]);
let idCounter = 0;
const drawerVisible = ref(false);
const foodLabels = [
  '食物', '麵、飯、麵包、蔬菜、水果、豬肉、豆干、等等) ', '影像位置', '烹飪方式 (炸、烤、煎、炒、滷、蒸、等等)', '調味(醬:糖醋/泰式/蘑菇/黑胡椒/等等、辣椒、起司粉、等等)', '熱量 (kcal/100g)', '蛋白質 (g/100g)', '脂質 (g/100g)', '碳水 (g/100g)',
];

const formItems = foodLabels.map((label, i) => ({
  label: label,
  path: `name${i + 1}`
}));

function createFormData(): FormData {
  return formItems.reduce((acc, item) => ({
    ...acc,
    [item.path]: ''
  }), {});
}

const currentLabelIndex = ref(1);
function resetLabelIndex() {
  currentLabelIndex.value = 1;
}

function addFormWithData(selectionData: { id: any; }) {
  const store = useSelectionStore();
  console.log('Received selection-saved with ID:', selectionData.id);
  forms.push({
    id: selectionData.id,
    imageUrl: selectionData.imageUrl,
    data: createFormData(),
    editable: true,
    labelIndex: store.getNextLabelIndex(),
    isCustom: false,
    canSubmit: true
  });
}


function addForm() {
  const store = useSelectionStore();
  forms.push({
    id: `form-${idCounter++}`,
    data: createFormData(),
    editable: true,
    label: `自定義${store.getNextCustomIndex()}`,
    labelIndex: 0,
    imageUrl: '',
    isCustom: true,
    canSubmit: true
  });
}

function handleSelectionRemoved(data: { id: string; }) {
  console.log('Received selection-removed with ID:', data.id);
  const index = forms.findIndex(form => form.id === data.id);
  if (index !== -1) {
    console.log('Removing form with index:', index);
    forms.splice(index, 1);
  }
}

const dialog = useDialog();
// const showModal = ref(false);
const isSubmitting = ref(false);
function confirmSubmit(form: FormInstance) {
  if (!form.canSubmit) return;

  isSubmitting.value = true;
  dialog.success({
    title: '確認提交',
    content: '你確定要提交這個表單吗？',
    positiveText: '確定',
    negativeText: '取消',
    onPositiveClick: () => submitForm(form)
  });
  setTimeout(() => {
    isSubmitting.value = false;
  }, 2000);
}

const showModal = ref(false);
function submitForm(form: FormInstance) {
  console.log('提交表单:', form.data);
  form.editable = false;
  form.canSubmit = false;

  history.value.push({
    id: form.id,
    label: form.label || `Image${form.labelIndex}`,
    data: { ...form.data },
    imageUrl: form.imageUrl,
    timestamp: Date.now()
  });
  showModal.value = false;
}


function enableEditing(form: FormInstance) {
  form.editable = true;
  form.canSubmit = true;
}

function toggleDrawer() {
  drawerVisible.value = !drawerVisible.value;
}


function confirmRemoveForm(formId: string) {
  dialog.error({
    title: '確認刪除',
    content: '您確定要刪除這個表單嗎？這個操作無法撤銷。',
    positiveText: '確定刪除',
    negativeText: '取消',
    onPositiveClick: () => {
      removeForm(formId);
      dialog.destroyAll();
    }
  });
}

function removeForm(formId: string) {
  const formIndex = forms.findIndex(form => form.id === formId);
  if (formIndex !== -1) {
    console.log('Removing form with index:', formIndex);
    forms.splice(formIndex, 1);
    const historyIndex = history.value.findIndex(h => h.id === formId);
    if (historyIndex !== -1) {
      history.value.splice(historyIndex, 1);
    }
    if (imagePreviewRef.value) {
      (imagePreviewRef.value as any)?.removeSelectionById(formId);
    }
    if (forms.length === 0) {
      resetLabelIndex();
    }
  }
}


// FoodListPage.vue 的 <script setup>
function handleRemoveForm(formId) {
  const formIndex = forms.findIndex(form => form.id === formId);
  if (formIndex !== -1) {
    forms.splice(formIndex, 1);
    const historyIndex = history.value.findIndex(h => h.id === formId);
    if (historyIndex !== -1) {
      history.value.splice(historyIndex, 1);
    }
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

.item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-part,
.right-part {
  flex: 1;
  padding: 5px;
}

.form-title-container {
  display: flex;
  align-items: center;
}

.form-image-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
}

.default-icon-container {
  width: 50px;
  height: 50px;
  margin-right: 12px;
  max-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  border-radius: 8px
}

.form-image-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 8px
}
</style>

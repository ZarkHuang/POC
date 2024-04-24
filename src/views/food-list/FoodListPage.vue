<template>
  <NSpace vertical>
    <NGrid cols="2" x-gap="12">
      <NGi :span="1">
        <ImagePreview ref="imagePreviewRef" @selection-saved="addFormWithData"
          @selection-removed="handleSelectionRemoved" />
      </NGi>
      <NGi :span="1">
        <div class="form-header">
          <PageTitle>辨識結果</PageTitle>
          <div class="button-group">
            <NButton @click="addForm" style="margin-right:10px">新增表單</NButton>
            <NButton type="primary" @click="drawerVisible = true">歷史紀錄</NButton>
          </div>
          <NDrawer v-model:show="drawerVisible" placement="right" :width="600">
            <div>歷史紀錄</div>
          </NDrawer>
        </div>
        <NScrollbar style="max-height: calc(100vh - 158px);">
          <div v-for="(form, index) in forms" :key="form.id" class="form-content">
            <NGrid cols="3" justify="end">
              <NGi>
                <NH5 class="form-title">{{ form.label || `Image${form.labelIndex}` }}</NH5>

              </NGi>

              <NGi :span="2">
                <div style="display: flex; justify-content: flex-end; align-items: center;">
                  <NH5 class="form-title" style="margin: 0px 16px;">名字：王大明</NH5>
                  <NH5 class="form-title" style="margin: 0px;">時間：
                    <NTime :time="Date.now()" type="date" />
                  </NH5>
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
                <NGi v-for="item in formItems.slice(9)" :key="`second-${item.path}`">
                  <NFormItem :label="item.label" :path="item.path">
                    <NInput :disabled="!form.editable" v-model:value="form.data[item.path]" />
                  </NFormItem>
                </NGi>
              </NGrid>
            </NForm>
            <div style="display: flex; justify-content: end;">
              <!-- <NButton type="primary" @click="submitForm(form)">提交</NButton> -->
              <NButton @click="toggleEdit(form)" style='margin-right:10px'>{{ form.editable ? '確定' : '編輯' }}</NButton>
              <NButton type="error" @click="removeForm(form.id)">刪除</NButton>
            </div>
          </div>
        </NScrollbar>
      </NGi>
    </NGrid>
  </NSpace>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { NForm, NFormItem, NInput, NButton, NGrid, NGi, NScrollbar, NDrawer } from 'naive-ui';
import ImagePreview from '@/views/food-list/_components/ImagePreview.vue';
const imagePreviewRef = ref(null);
import { useSelectionStore } from '@/stores/selectionStore';

interface FormData {
  [key: string]: string | null;
}

interface FormInstance {
  id: string;
  data: FormData;
  editable: boolean;
  labelIndex: number;
}

const forms = reactive<FormInstance[]>([]);

let idCounter = 0;

const drawerVisible = ref(false);


const foodLabels = [
  '食物', '種類 ', '影像位置', '烹飪方式', '調味', '熱量', '蛋白質', '脂質', '碳水',
  '食物', '種類 ', '影像位置', '烹飪方式', '調味', '熱量', '蛋白質', '脂質', '碳水',
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

function addFormWithData(selectionData) {
  const store = useSelectionStore();
  console.log('Received selection-saved with ID:', selectionData.id);
  forms.push({
    id: selectionData.id,
    data: createFormData(),
    editable: true,
    labelIndex: store.getNextLabelIndex()
  });
}


function addForm() {
  const store = useSelectionStore();
  forms.push({
    id: `form-${idCounter++}`,
    data: createFormData(),
    editable: true,
    label: `自定義${store.getNextCustomIndex()}`  // 使用自定義編號
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

function submitForm(_form: FormInstance) {
  console.log('提交表單:', forms.map(form => form.data));
  forms.forEach(form => form.editable = false);
}

function toggleEdit(form: FormInstance) {
  form.editable = !form.editable;
}

function removeForm(formId: string) {
  const index = forms.findIndex(form => form.id === formId);
  if (index !== -1) {
    forms.splice(index, 1);
    imagePreviewRef.value?.removeSelectionById(formId);
  }
  if (forms.length === 0) {
    resetLabelIndex();
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
</style>

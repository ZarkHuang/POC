<template>
  <NSpace vertical>
    <NGrid cols="12" x-gap="12">
      <NGi class="image-selector">
        <ImageSelector :images="images.map(image => ({ url: image.thumbnailUrl }))" @update:selectedImage="updateSelectedImage" :selectedImage="selectedImage" />
      </NGi>
      <NGi :span="10">
        <ImageCarousel :images="images.map(image => ({ url: image.fullImageUrl }))" :selectedImage="selectedImage" />
      </NGi>


      <!-- 表單區域 -->
      <NGi :span="12">
        <NDivider />
        <div class="form-header">
          <PageTitle>辨識結果</PageTitle>
        </div>
        <NScrollbar>
          <div v-for="form in forms" :key="form.id" class="form-content">
            <NGrid cols="1" justify="end" class="form-title-container" style="margin-bottom: 12px; margin-top: -12px">
              <NGi justify="end">
                <div style="
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    width: 100%;
                  ">
                  <NH5 class="form-title" style="margin: 0px 16px">名字：王大明</NH5>
                  <NH5 class="form-title" style="margin: 0px 16px">
                    時間：
                    <NTime :time="Date.now()" type="date" />
                  </NH5>
                  <EditButton type="primary" ghost :form="form" @edit="enableEditing" :isDisabled="isSubmitting" />
                </div>
              </NGi>
            </NGrid>
            <NSpace vertical>
              <NTable striped>
                <thead>
                  <tr>
                    <th v-for="label in foodLabels" :key="label">
                      {{ label }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in form.inputGroups" :key="row[0]?.path">
                    <td v-for="item in row" :key="item.path">
                      <NInput v-model:value="form.data[item.path]" :disabled="!form.editable" />
                    </td>
                  </tr>
                </tbody>
              </NTable>
            </NSpace>
            <div style="display: flex; justify-content: space-between">
              <NButton @click="addMultipleInputs(form)" type="primary" style="margin-left: 10px">+</NButton>
              <NButton @click="confirmSubmit(form)" :disabled="!form.canSubmit" style="margin-right: 10px">提交</NButton>
            </div>
          </div>
        </NScrollbar>
      </NGi>
    </NGrid>
  </NSpace>
</template>

<script setup lang="ts">
import { reactive, ref , onMounted, Ref } from 'vue'
import { NInput, NButton, NGrid, NGi, NScrollbar, useDialog } from 'naive-ui'
import { FormData, FormInstance, HistoryItem } from '@/global'
import ImageSelector from '@/views/food-list/ImageSelector.vue'
import ImageCarousel from '@/views/food-list/ImageCarousel.vue'
//compoment
import EditButton from '@/views/food-list/_components/button/EditButton.vue'
import { fetchUserImages } from '@/services/api/report';
import { useAuthStore } from '@/stores/authStore';


interface Image {
  thumbnailUrl: string;
  fullImageUrl: string;
}
const images: Ref<Image[]> = ref([]);
const authStore = useAuthStore(); 

onMounted(async () => {
  try {
    if (authStore.authState.isLoggedIn && authStore.authState.token) {
      const response = await fetchUserImages();
      if (response) { 
        images.value = response.map((img: { image_id: string }) => ({
          thumbnailUrl: `https://food-ai.efaipd.com/api/images/${img.image_id}/thumbnail`,
          fullImageUrl: `https://food-ai.efaipd.com/api/images/${img.image_id}/view`
        }));
      }
      console.log(images);
    } else {
      console.error('Not logged in or token is missing');
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
});


function updateSelectedImage(index: number) {
  selectedImage.value = index;
}

const selectedImage = ref(0)
const history: Ref<HistoryItem[]> = ref([])
const forms = reactive<FormInstance[]>([])
let idCounter = 0

const foodLabels = [
  '食物(麵、飯、麵包、蔬菜..等等)',
  '烹飪方式 (炸、烤、煎、炒、滷...等等)',
  '數量',
  '熱量 (kcal/100g)',
  '蛋白質 (g/100g)',
  '脂質 (g/100g)',
  '碳水碳水化合物 (g/100g)',
]

const formItems = foodLabels.map((label, i) => ({
  label: label,
  path: `name${i + 1}`,
}))
function createFormData(): FormData {
  return formItems.reduce(
    (acc, item) => ({
      ...acc,
      [item.path]: '',
    }),
    {},
  )
}

function createFormItems() {
  return foodLabels.map((label, index) => ({
    label: label,
    path: `name${index + 1}`,
  }))
}

function addMultipleInputs(form: FormInstance) {
  const newFormItems = foodLabels.map((label, index) => ({
    label: label,
    path: `name${form.formItems.length + index + 1}`, // 確保鍵值唯一
  }))

  // 新增至 formItems 和 inputGroups
  form.formItems.push(...newFormItems)
  form.inputGroups.push(newFormItems)

  // 初始化空的輸入數據
  newFormItems.forEach((item) => {
    form.data[item.path] = ''
  })
}

// 新增初始表單
forms.push({
id: `form-${idCounter++}`,
data: createFormData(),
formItems: createFormItems(),
inputGroups: [createFormItems()],
editable: true,
canSubmit: true,
labelIndex: 0,
imageUrl: '',
isCustom: false
})

const dialog = useDialog()
const isSubmitting = ref(false)
function confirmSubmit(form: FormInstance) {
  if (!form.canSubmit) return

  dialog.success({
    title: '確認提交',
    content: '您確定要提交這個表單嗎？',
    positiveText: '確定',
    negativeText: '取消',
    onPositiveClick: () => submitForm(form),
  })
}

function submitForm(form: FormInstance) {
  console.log('提交:', form.data)

  form.editable = false
  form.canSubmit = false

  history.value.push({
    id: form.id,
    label: form.label || `Image${form.labelIndex}`,
    data: { ...form.data },
    imageUrl: form.imageUrl,
    originalImageUrl: form.originalImageUrl || '',
    timestamp: Date.now(),
  })
}

function enableEditing(form: FormInstance) {
  form.editable = true
  form.canSubmit = true
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

.form-title-container {
  display: flex;
  align-items: center;
}
</style>

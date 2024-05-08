<template>
    <NScrollbar>
        <div v-for="form in forms" :key="form.id" class="form-content">
            <NGrid cols="1" justify="end" class="form-title-container">
                <NGi justify="end">
                    <div style="display: flex; justify-content: flex-end; align-items: center; width: 100%;">
                        <NH5 class="form-title">名字：{{ form.name }}</NH5>
                        <NH5 class="form-title">
                            時間：
                            <NTime :time="form.time" type="date" />
                        </NH5>
                        <EditButton type="primary" ghost :form="form" @edit="enableEditing"
                            :isDisabled="isSubmitting" />
                    </div>
                </NGi>
            </NGrid>
            <NSpace vertical>
                <NTable striped>
                    <thead>
                        <tr>
                            <th v-for="label in form.labels" :key="label">{{ label }}</th>
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
                <NButton @click="addMultipleInputs(form)" type="primary">+</NButton>
                <NButton @click="confirmSubmit(form)" :disabled="!form.canSubmit">提交</NButton>
            </div>
        </div>
    </NScrollbar>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { NInput, NButton, NGrid, NGi, NScrollbar, NTable, NH5, NTime } from 'naive-ui';
import EditButton from '@/views/food-list/_components/button/EditButton.vue';

const props = defineProps<{
    forms: FormInstance[],
    enableEditing: Function,
    addMultipleInputs: Function,
    confirmSubmit: Function,
    isSubmitting: Boolean
}>();
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

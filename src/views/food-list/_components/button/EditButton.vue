<template>
  <NButton :disabled="isDisabled || !hasData" @click="toggleEditing">
    <NIcon :component="isEditing ? Checkmark : Edit" />
  </NButton>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { NButton, NIcon } from 'naive-ui';
import { Checkmark, Edit } from '@vicons/carbon';

const props = defineProps({
  isEditing: Boolean,
  isDisabled: Boolean,
  hasData: Boolean  // 新增prop來判斷是否有資料
});

const emit = defineEmits(['update:isEditing']);

function toggleEditing() {
  if (!props.hasData) {
    // 如果沒有資料，顯示提示
    emit('noData');
  } else if (!props.isDisabled) {
    emit('update:isEditing', !props.isEditing);
  }
}
</script>

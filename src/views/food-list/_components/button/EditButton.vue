<template>
  <NButton :disabled="isDisabled" @click="toggleEditing">
    <NIcon :component="isEditing ? Checkmark : Edit" />
  </NButton>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { NButton, NIcon } from 'naive-ui';
import { Checkmark, Edit } from '@vicons/carbon';

const props = defineProps({
  isEditing: Boolean,
  isDisabled: Boolean
});

const emit = defineEmits(['update:isEditing']);

function toggleEditing() {
  emit('update:isEditing', !props.isEditing);
}
</script>

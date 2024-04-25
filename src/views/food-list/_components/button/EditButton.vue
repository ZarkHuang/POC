<template>
    <NButton :disabled="isDisabled" @click="enableEditing">
        <NIcon :component="Edit" />
    </NButton>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui';
import { Edit } from '@vicons/carbon';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    form: Object,
    isDisabled: Boolean
});

const emit = defineEmits(['edit']);

function enableEditing() {
    if (!props.isDisabled) {
        emit('edit', props.form);
    }
}
</script>
<template>
    <NDrawer v-model:show="show" width="400px" title="详细信息">
        <p>这里是一些详细信息</p>
    </NDrawer>
</template>

<script setup>
import { ref } from 'vue';
import { NDrawer } from 'naive-ui';

const props = defineProps({
    show: Boolean
});

const emit = defineEmits(['update:show']);

function closeDrawer() {
    emit('update:show', false);
}
</script>
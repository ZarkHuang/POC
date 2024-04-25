<template>
    <NDrawer v-model:show="drawerVisible" placement="right" :width="600">
        <div class="history-header">歷史紀錄</div>
        <div class="history-content">
            <div v-for="(entry, index) in historyData" :key="index" class="history-item">
                <div v-if="entry.imageUrl">
                    <img :src="entry.imageUrl" alt="History Image" class="history-image" />
                </div>
                <div v-else class="default-icon-container">
                    <NIcon size="20" :component="NoImage" />
                </div>
                <div class="history-details">
                    <h5>{{ entry.label }}</h5>
                    <p>名字：王大明</p>
                    <p>時間：{{ new Date(entry.timestamp).toLocaleString() }}</p>
                    <!-- <div v-for="(value, key) in entry.data" :key="key">
                        <strong>{{ key }}:</strong> {{ value }}
                    </div> -->
                </div>
                <div @mouseover="hover = index" @mouseleave="hover = null" @click="confirmRemoveForm(entry.id)">
                    <NIcon :component="hover === index ? Close : CheckmarkFilled" class="history-checkmark"/>
                </div>
            </div>
        </div>
    </NDrawer>
</template>


<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import { NDrawer, NIcon } from 'naive-ui';
import { CheckmarkFilled, Close } from '@vicons/carbon';
import { NoImage } from '@vicons/carbon';

const props = defineProps({
    modelValue: Boolean,
    historyData: Array
});

const drawerVisible = ref(props.modelValue);
const emit = defineEmits(['update:modelValue', 'remove']);
const hover = ref(null);

watch(() => props.modelValue, (newVal) => {
    drawerVisible.value = newVal;
});

watch(drawerVisible, (newVal) => {
    emit('update:modelValue', newVal);
});
const dialog = useDialog();

function confirmRemoveForm(formId: string) {
    dialog.error({
        title: '確認刪除',
        content: '您確定要刪除這個記錄嗎？這個操作無法撤銷。',
        positiveText: '確定刪除',
        negativeText: '取消',
        onPositiveClick: () => {
            emit('remove', formId);
        }
    });
}

</script>

<style scoped>
.history-header {
    font-size: 20px;
    font-weight: bold;
    margin: 20px 20px 20px 0;
    padding: 0 20px;
}

.history-content {
    overflow-y: auto;
    max-height: 80vh;
    padding: 0 20px;
}

.history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 15px;
}

.history-checkmark {
    flex-shrink: 0;
    color: #4CAF50;
    font-size: 24px;
}

.history-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin-right: 20px;
    border-radius: 10px;
}

.history-details {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.history-details h5 {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
}

.history-details p {
    font-size: 14px;
    color: #666;
    margin: 2px 0;
}

.default-icon-container {
    width: 100px;
    height: 100px;
    background-color: #f0f0f0;
    /* 灰色背景 */
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    border-radius: 10px;
}
</style>

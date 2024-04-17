<template>
    <div class="close-icon" @click="emitClose($event)">
        &#10005;
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close']);

function emitClose(event: { stopPropagation: () => void; }) {
    event.stopPropagation();
    emit('close');
}
</script>

<style scoped>
.close-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #eee;
    cursor: pointer;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    transition: background-color 0.2s, color 0.2s;
}

.close-icon:hover {
    background-color: #34495e;
    color: white;
}
</style>
<template>
    <div class="file-upload">
        <div class="file-select">
            <div class="file-select-button" id="fileName">選擇文件</div>
            <div class="file-select-name" id="noFile">{{ fileName }}</div>
            <input type="file" name="chooseFile" id="chooseFile" accept="image/*" @change="fileChanged" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const message = useMessage()
const props = defineProps({
    fileName: String,
})
const emits = defineEmits(['file-selected'])

const localFileName = ref(props.fileName)

watch(
    () => props.fileName,
    (newVal) => {
        localFileName.value = newVal
    },
)

function fileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file) {
        if (/^image\/(jpeg|png|gif)$/.test(file.type)) {
            localFileName.value = file.name;
            emits('file-selected', file);
        } else {
            message.error('上傳格式錯誤：只接受 JPEG, PNG, 或 GIF 格式的圖片文件。');
        }
    } else {
        localFileName.value = '未選擇文件...';
    }
}


</script>

<style scoped>
.file-upload {
    display: block;
    text-align: center;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 12px;
}

.file-upload .file-select {
    display: block;
    border: 2px solid #dce4ec;
    color: #34495e;
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    text-align: left;
    background: #ffffff;
    overflow: hidden;
    position: relative;
}

.file-upload .file-select .file-select-button {
    background: #dce4ec;
    padding: 0 10px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
}

.file-upload .file-select .file-select-name {
    line-height: 40px;
    display: inline-block;
    padding: 0 10px;
}

.file-upload .file-select:hover {
    border-color: #34495e;
    transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
}

.file-upload .file-select:hover .file-select-button {
    background: #34495e;
    color: #ffffff;
    transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
}

.file-upload.active .file-select {
    border-color: #3fa46a;
    transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
}

.file-upload.active .file-select .file-select-button {
    background: #3fa46a;
    color: #ffffff;
    transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
}

.file-upload .file-select input[type='file'] {
    z-index: 100;
    cursor: pointer;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    filter: alpha(opacity=0);
}

.file-upload .file-select.file-select-disabled {
    opacity: 0.65;
}

.file-upload .file-select.file-select-disabled:hover {
    cursor: default;
    display: block;
    border: 2px solid #dce4ec;
    color: #34495e;
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    margin-top: 5px;
    text-align: left;
    background: #ffffff;
    overflow: hidden;
    position: relative;
}

.file-upload .file-select.file-select-disabled:hover .file-select-button {
    background: #dce4ec;
    color: #666666;
    padding: 0 10px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
}

.file-upload .file-select.file-select-disabled:hover .file-select-name {
    line-height: 40px;
    display: inline-block;
    padding: 0 10px;
}
</style>


<style scoped>
.file-upload {
    display: block;
    text-align: center;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 12px;
}

.file-upload .file-select {
    display: block;
    border: 2px solid #dce4ec;
    color: #34495e;
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    text-align: left;
    background: #ffffff;
    overflow: hidden;
    position: relative;
}

.file-upload .file-select .file-select-button {
    background: #dce4ec;
    padding: 0 10px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
}

.file-upload .file-select .file-select-name {
    line-height: 40px;
    display: inline-block;
    padding: 0 10px;
}

.file-upload .file-select:hover {
    border-color: #34495e;
    transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
}

.file-upload .file-select:hover .file-select-button {
    background: #34495e;
    color: #ffffff;
    transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
}

.file-upload.active .file-select {
    border-color: #3fa46a;
    transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
}

.file-upload.active .file-select .file-select-button {
    background: #3fa46a;
    color: #ffffff;
    transition: all 0.2s ease-in-out;
    -moz-transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
}

.file-upload .file-select input[type='file'] {
    z-index: 100;
    cursor: pointer;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    filter: alpha(opacity=0);
}

.file-upload .file-select.file-select-disabled {
    opacity: 0.65;
}

.file-upload .file-select.file-select-disabled:hover {
    cursor: default;
    display: block;
    border: 2px solid #dce4ec;
    color: #34495e;
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    margin-top: 5px;
    text-align: left;
    background: #ffffff;
    overflow: hidden;
    position: relative;
}

.file-upload .file-select.file-select-disabled:hover .file-select-button {
    background: #dce4ec;
    color: #666666;
    padding: 0 10px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
}

.file-upload .file-select.file-select-disabled:hover .file-select-name {
    line-height: 40px;
    display: inline-block;
    padding: 0 10px;
}
</style>

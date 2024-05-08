<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useAdminLogin } from '@/services/api'
import {
useMessage,
  type FormInst,
  type FormRules,
  type FormValidationError,
} from 'naive-ui'
import { useRouter } from 'vue-router';

type FormData = {
  acc: string // 使用 `acc` 作為帳號
  password: string
  remember: boolean
}

const authStore = useAuthStore()
const message = useMessage()
const router = useRouter()
const formRef = ref<FormInst | null>(null)
const formData = ref<FormData>({
  acc: 'label1', // 預設值
  password: 'test1234',
  remember: false,
})
const rules: FormRules = {
  acc: [
    {
      required: true,
      message: '帳號是必填項',
      trigger: ['blur', 'input'],
    },
  ],
  password: [
    {
      required: true,
      message: '密碼是必填項',
      trigger: ['blur', 'input'],
    },
  ],
}

// 使用 useAdminLogin 來創建 mutation
const loginMutation = useAdminLogin()

function handleSignInClick(e: MouseEvent) {
  e.preventDefault()

  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      loginMutation.mutate(
        {
          data: {
            acc: formData.value.acc,
            pwd: formData.value.password,
          },
        },
        {
          onSuccess: (response: { access_token: any; }) => {
            console.log('Login response:', response)
            const token = response.access_token
            authStore.setLoginStatus(true, token)
            message.success('登入成功')
            router.push({ name: 'food-list' });
          },
          onError: (error: any) => {
            message.error(
              `登入失敗：${error?.response?.data?.message || error.message}`,
            )
          },
        },
      )
    } else {
      errors.forEach((error) => {
        message.error(error?.[0]?.message ?? '')
      })
    }
  })
}
</script>

<template>
  <NForm ref="formRef" :model="formData" :rules="rules">
    <NFormItem label="帳號" path="acc">
      <NInput v-model:value="formData.acc" clearable autofocus />
    </NFormItem>

    <NFormItem label="密碼" path="password">
      <NInput
        v-model:value="formData.password"
        type="password"
        show-password-on="mousedown"
        clearable
      />
    </NFormItem>

    <NFormItem path="remember" :show-label="false" :show-feedback="false">
      <NCheckbox>記住我</NCheckbox>
    </NFormItem>

    <NFormItem :show-feedback="false" :class="$style.signInButton">
      <NButton type="primary" secondary block @click="handleSignInClick">
        登入
      </NButton>
    </NFormItem>
  </NForm>
</template>

<style module lang="scss">
.signInButton {
  margin-top: 32px;
}
</style>
